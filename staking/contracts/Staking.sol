pragma solidity ^0.8.0;

contract Staking{
    address public owner;

    struct Position {
        uint posId;
        address wallet;
        uint creatDate;
        uint unlockDate;
        uint interest;
        uint stakeAmount;
        uint stakeInterest;
        bool start;
    }

    Position position;

    uint public currentposId;
    mapping(uint => Position) public positions;
    mapping(address => uint[]) public addressposId;
    mapping(uint => uint) public stakingPeriod;
    uint[] public lock;

    constructor() payable {
        owner = msg.sender;
        currentposId = 0;
        stakingPeriod[30] = 500;
        lock.push(30);
        stakingPeriod[90] = 1000;
        lock.push(90);
        stakingPeriod[180] = 2000;
        lock.push(180);
    }

    function stakeEther(uint day) external payable {
        positions[currentposId] = Position(
            currentposId,
            msg.sender,
            block.timestamp,
            block.timestamp + (day * 1 days),
            stakingPeriod[day],
            msg.value,
            calInterest(stakingPeriod[day], msg.value),
            true
        );

        addressposId[msg.sender].push(currentposId);
        currentposId += 1;

    }

    function calInterest(uint points, uint weiAmount) private pure returns(uint) {
        return points * weiAmount / 10000;
    }

    function getLockPeriods() external view returns(uint[] memory){
        return lock;
    }

    function getInterest(uint day) external view returns(uint){
        return stakingPeriod[day];
    }

    function getPos(uint posId) external view returns(Position memory){
        return positions[posId];
    }

    function getPosAddress(address wallet) external view returns(uint[] memory){
        return addressposId[wallet];
    }

    function closePos(uint posId) external {
        positions[posId].start = false;

        if(block.timestamp > positions[posId].unlockDate){
            uint amount = positions[posId].stakeAmount + positions[posId].stakeInterest;
            payable(msg.sender).call{value: amount}("");
        } else{
            payable(msg.sender).call{value: positions[posId].stakeAmount}("");
        }
    }

    function modifyLock(uint day, uint points) external {
        stakingPeriod[day] = points;
        lock.push(day);
    }

    function changeUnlock(uint posId, uint newUnlockDate) external {
        positions[posId].unlockDate = newUnlockDate;
    }

}
