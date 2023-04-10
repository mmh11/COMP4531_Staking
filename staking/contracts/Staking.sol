pragma solidity ^0.8.0;

contract Staking{
    address public owner;

    struct Position {
        uint positionId;
        address walletAddress;
        uint createdDate;
        uint unlockDate;
        uint percentInterest;
        uint weiStaked;
        uint weiInterest;
        bool open;
    }

    Position position;

    uint public currentPositionId;
    mapping(uint => Position) public positions;
    mapping(address => uint[]) public positionIdsByAddress;
    mapping(uint => uint) public tiers;
    uint[] public lockPeriods;

    constructor() payable {
        owner = msg.sender;
        currentPositionId = 0;

        tiers[30] = 500;
        tiers[90] = 1000;
        tiers[180] = 2000;

        lockPeriods.push(30);
        lockPeriods.push(90);
        lockPeriods.push(180);
    }

    function stakeEther(uint numDays) external payable {
        positions[currentPositionId] = Position(
            currentPositionId,
            msg.sender,
            block.timestamp,
            block.timestamp + (numDays * 1 days),
            tiers[numDays],
            msg.value,
            calculateInterest(tiers[numDays], numDays, msg.value),
            true
        );

        positionIdsByAddress[msg.sender].push(currentPositionId);
        currentPositionId += 1;

    }

    function calculateInterest(uint basisPoints, uint numDays, uint weiAmount) private pure returns(uint) {
        return basisPoints * weiAmount / 10000;
    }

    function getLockPeriods() external view returns(uint[] memory){
        return lockPeriods;
    }

    function getInterestRate(uint numDays) external view returns(uint){
        return tiers[numDays];
    }

    function getPositionById(uint positionId) external view returns(Position memory){
        return positions[positionId];
    }

    function getPositionIdsForAddress(address walletAddress) external view returns(uint[] memory){
        return positionIdsByAddress[walletAddress];
    }

    function closePosition(uint positionId) external {
        require(positions[positionId].walletAddress == msg.sender, "Owner only");
        require(positions[positionId].open == true, "Position close");

        positions[positionId].open = false;

        if(block.timestamp > positions[positionId].unlockDate){
            uint amount = positions[positionId].weiStaked + positions[positionId].weiInterest;
            payable(msg.sender).call{value: amount}("");
        } else{
            payable(msg.sender).call{value: positions[positionId].weiStaked}("");
        }
    }

    function modifyLockPeriods(uint numDays, uint basisPoints) external {
        tiers[numDays] = basisPoints;
        lockPeriods.push(numDays);
    }

    function changeUnlockDate(uint positionId, uint newUnlockDate) external {
        positions[positionId].unlockDate = newUnlockDate;
    }

}
