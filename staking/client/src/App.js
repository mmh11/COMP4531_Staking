import react, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ethers } from 'ethers';
import artifact from './artifacts/contracts/Staking.sol/Staking.json'
import Background from "./images/background.jpg"
import NavBar from './components/NavBar'
import Home from './pages/home'
import Staking from './pages/staking'

// reference: https://gist.github.com/BlockmanCodes/999d72e6a2c74e3b8c8de565e5400941

const CONTRACT_ADDRESS = '0x9d4454B023096f34B160D6B654540c56A1F81688'

export default function App() {
  const [provider, setProvider] = useState(undefined)
  const [signer, setSigner] = useState(undefined)
  const [contract, setContract] = useState(undefined)
  const [signerAddress, setSignerAddress] = useState(undefined)

  const [assetIds, setAssetIds] = useState([])
  const [assets, setAssets] = useState([])

  const [showStakeModel, setShowStakeModel] = useState(false)
  const [stakingLength, setStakingLength] = useState(undefined)
  const [stakingPercent, setStakingPercent] = useState(undefined)
  const [amount, setAmount] = useState(0)

  const toWei = ether => ethers.parseEther(ether)
  const toEther = wei => ethers.formatEther(wei)

  useEffect(() => {
    const onLoad = async () => {
      const provider = await new ethers.BrowserProvider(window.ethereum)
      setProvider(provider)

      const contract = await new ethers.Contract(
        CONTRACT_ADDRESS,
        artifact.abi
      )
      setContract(contract)
    }
    onLoad()
  }, [])

  useEffect(() => {
    if (!showStakeModel) {
      //  clear the amount whenever the stake model is closed
      // console.log('stake model is closed')
      setAmount(0)
    }
  }, [showStakeModel])

  const isConnected = () => signer !== undefined

  const getSigner = async () => {
    provider.send("eth_requestAccounts", [])
    const signer = provider.getSigner()
    return signer
  }

  const getAssetIds = async (address, signer) => {
    const assetIds = await contract.connect(signer).getPosAddress(address)
    return assetIds
  }

  const calcDaysRemaining = (unlockDate) => {
    const timeNow = Date.now() / 1000
    const secondsRemaining = unlockDate - timeNow
    return Math.max( (secondsRemaining / 60 / 60 / 24).toFixed(0), 0)
  }

  const getAssets = async (ids, signer) => {
    const queriedAssets = await Promise.all(
      ids.map(id => contract.connect(signer).getPos(id))
    )

    queriedAssets.map(async asset => {
      const parsedAsset = {
        posId: asset.posId,
        interest: Number(asset.interest) / 100,
        daysRemaining: calcDaysRemaining( Number(asset.unlockDate) ),
        etherInterest: toEther(asset.stakeInterest),
        etherStaked: toEther(asset.stakeAmount),
        start: asset.start,
      }

      setAssets(prev => [...prev, parsedAsset])
    })
  }

  const connectAndLoad = async () => {
    const signer = await getSigner(provider)
    setSigner(signer)

    const signerAddress = await signer.getAddress()
    setSignerAddress(signerAddress)

    const assetIds = await getAssetIds(signerAddress, signer)
    setAssetIds(assetIds)

    getAssets(assetIds, signer)
  }

  const openStakingModel = (stakingLength, stakingPercent) => {
    setShowStakeModel(true)
    setStakingLength(stakingLength)
    setStakingPercent(stakingPercent)
  }

  const stakeEther = () => {

    console.log('amount: ', amount)
    if (amount && amount > 0 ) {
      const wei = toWei(amount)
      const data = { value: wei }
      contract.connect(signer).stakeEther(stakingLength, data)
    } else {
      // console.log('Amount is missing')
      const text = 'Amount should larger than 0! Current input amount is ' + amount
      window.alert(text)

    }
  }

  const withdraw = posId => {
    contract.connect(signer).closePos(posId)
  }

  return (
    <div style={{ 
      backgroundImage: `url(${Background})`,
      height: "100vh",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover"
      }}>
      <NavBar 
        isConnected={isConnected}
        connect={connectAndLoad}/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/staking" element={
          <Staking
            withdraw={withdraw}
            showStakeModel={showStakeModel}
            openStakingModel={openStakingModel}
            setShowStakeModel={setShowStakeModel}
            stakingLength={stakingLength}
            stakingPercent={stakingPercent}
            amount={amount}
            setAmount={setAmount}
            stakeEther={stakeEther}
            assets={assets}
          />
        }/>
      </Routes>
    </div>
  );
}
