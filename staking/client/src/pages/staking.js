import './App.css';
import react, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import artifact from '../artifacts/contracts/Staking.sol/Staking.json'
import StakeModel from '../components/StakeModel'
import { Bank, PiggyBank, Coin } from 'react-bootstrap-icons'


const Staking = props => {
  return (
    <div className="App">
      <div className="appBody">
        <div className="marketContainer">
          <div className="subContainer">
            <span>
              <img className="logoImg" src={require("../images/Ethereum_logo_webp.webp")}/>
            </span>
            <span className="marketHeader">Ethereum Market APY</span>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div onClick={() => props.openStakingModel(30, '2%')} className="marketOption">
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
              <div onClick={() => props.openStakingModel(90, '5%')} className="marketOption">
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
              <div onClick={() => props.openStakingModel(180, '10%')} className="marketOption">
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
          {props.assets.length > 0 && props.assets.map((a, idx) => (
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
                  <div onClick={() => props.withdraw(a.positionId)} className="orangeMiniButton">Withdraw</div>
                ) : (
                  <span>closed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {props.showStakeModel && (
        <StakeModel
          onClose={() => props.setShowStakeModel(false)}
          stakingLength={props.stakingLength}
          stakingPercent={props.stakingPercent}
          amount={props.amount}
          setAmount={props.setAmount}
          stakeEther={props.stakeEther}
        />
      )}
    </div>
  );
}

export default Staking;