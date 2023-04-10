import react, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ethers } from 'ethers';
import artifact from './artifacts/contracts/Staking.sol/Staking.json'
import Background from "./images/background.jpg"
import NavBar from './components/NavBar'
import Home from './pages/home'
import Staking from './pages/staking'
import StakeModel from './components/StakeModel'
import { Bank, PiggyBank, Coin } from 'react-bootstrap-icons'

const CONTRACT_ADDRESS = '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82'

export default function App() {
  // general
  const [provider, setProvider] = useState(undefined)
  const [signer, setSigner] = useState(undefined)
  const [contract, setContract] = useState(undefined)
  const [signerAddress, setSignerAddress] = useState(undefined)

  // assets
  const [assetIds, setAssetIds] = useState([])
  const [assets, setAssets] = useState([])

  // staking
  const [showStakeModel, setShowStakeModel] = useState(false)
  const [stakingLength, setStakingLength] = useState(undefined)
  const [stakingPercent, setStakingPercent] = useState(undefined)
  const [amount, setAmount] = useState(0)

  // helpers
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

  const isConnected = () => signer !== undefined

  const getSigner = async () => {
    provider.send("eth_requestAccounts", [])
    const signer = provider.getSigner()
    return signer
  }

  const getAssetIds = async (address, signer) => {
    const assetIds = await contract.connect(signer).getPositionIdsForAddress(address)
    return assetIds
  }

  const calcDaysRemaining = (unlockDate) => {
    const timeNow = Date.now() / 1000
    const secondsRemaining = unlockDate - timeNow
    return Math.max( (secondsRemaining / 60 / 60 / 24).toFixed(0), 0)
  }

  const getAssets = async (ids, signer) => {
    const queriedAssets = await Promise.all(
      ids.map(id => contract.connect(signer).getPositionById(id))
    )

    queriedAssets.map(async asset => {
      const parsedAsset = {
        positionId: asset.positionId,
        percentInterest: Number(asset.percentInterest) / 100,
        daysRemaining: calcDaysRemaining( Number(asset.unlockDate) ),
        etherInterest: toEther(asset.weiInterest),
        etherStaked: toEther(asset.weiStaked),
        open: asset.open,
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
      console.log('Amount is missing')
      window.alert('Amount should larger than 0!')

    }
  }

  const withdraw = positionId => {
    contract.connect(signer).closePosition(positionId)
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
