import './App.css';
import react, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import artifact from './artifacts/contracts/Staking.sol/Staking.json'

import NavBar from './components/NavBar'
import StakeModel from './components/StakeModel'
import { Bank, PiggyBank, Coin } from 'react-bootstrap-icons'

const CONTRACT_ADDRESS = '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853'

function App() {
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
    const wei = toWei(amount)
    const data = { value: wei }
    contract.connect(signer).stakeEther(stakingLength, data)
  }

  const withdraw = positionId => {
    contract.connect(signer).closePosition(positionId)
  }

  return (
    <div className="App">
      <div>
        <NavBar
          isConnected={isConnected}
          connect={connectAndLoad}
        />
      </div>

      <div className="appBody">
        <div className="marketContainer">
          <div className="subContainer">
            <span>
              <img className="logoImg" src="eth-logo.webp"/>
            </span>
            <span className="marketHeader">Ethereum Market APY</span>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div onClick={() => openStakingModel(30, '2%')} className="marketOption">
                <div className="glyphContainer hoverButton">
                  <span className="glyph">
                    <Coin />
                  </span>
                </div>
                <div className="optionData">
                  <span>1 Month </span>
                  <span className="optionPercent">2%</span>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div onClick={() => openStakingModel(90, '5%')} className="marketOption">
                <div className="glyphContainer hoverButton">
                  <span className="glyph">
                    <Coin />
                  </span>
                </div>
                <div className="optionData">
                  <span>3 Months </span>
                  <span className="optionPercent">5%</span>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div onClick={() => openStakingModel(180, '10%')} className="marketOption">
                <div className="glyphContainer hoverButton">
                  <span className="glyph">
                    <Coin />
                  </span>
                </div>
                <div className="optionData">
                  <span>6 Months </span>
                  <span className="optionPercent">10%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="assetContainer">
          <div className="subContainer">
            <span className="marketHeader">Staked Assets</span>
          </div>
          <div>
            <div className="row columnHeaders">
              <div className="col-md-2">Assets</div>
              <div className="col-md-2">APY</div>
              <div className="col-md-2">Staked</div>
              <div className="col-md-2">Interest</div>
              <div className="col-md-2">Days Remaining</div>
              <div className="col-md-2"></div>
            </div>
          </div>
          <br />
          {assets.length > 0 && assets.map((a, idx) => (
            <div className="row">
              <div className="col-md-2">
                <span>
                  <img className="stakedLogoImg" src="eth-logo.webp" />
                </span>
              </div>
              <div className="col-md-2">
                {a.percentInterest} %
              </div>
              <div className="col-md-2">
                {a.etherStaked}
              </div>
              <div className="col-md-2">
                {a.etherInterest}
              </div>
              <div className="col-md-2">
                {a.daysRemaining}
              </div>
              <div className="col-md-2">
                {a.open ? (
                  <div onClick={() => withdraw(a.positionId)} className="orangeMiniButton">Withdraw</div>
                ) : (
                  <span>closed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {showStakeModel && (
        <StakeModel
          onClose={() => setShowStakeModel(false)}
          stakingLength={stakingLength}
          stakingPercent={stakingPercent}
          amount={amount}
          setAmount={setAmount}
          stakeEther={stakeEther}
        />
      )}
    </div>
  );
}

export default App;