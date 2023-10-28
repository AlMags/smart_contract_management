// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit() public payable {
        uint256 _amount = 1;
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    function specifiedDeposit(uint256 _amount) public payable{
        uint _previousBalance = balance;

        require(msg.sender == owner, "Your are not the owner of this account");
        
        balance += _amount;

        assert(balance == _previousBalance + _amount);
        
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw() public {
        uint256 _amount = 1;
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _amount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _amount
            });
        }

        // withdraw the given amount
        balance -= 1;

        // assert the balance is correct
        assert(balance == (_previousBalance - _amount));

        // emit the event
        emit Withdraw(_amount);
    }

    function specifiedWithdraw(uint256 _amount) public {
        require(msg.sender == owner, "You are not the owner of this account");

        uint _previousBalance = balance;
        if(balance < _amount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _amount
            });
        }

        balance -= _amount;

        assert(balance == (_previousBalance - _amount));

        emit Withdraw(_amount);
    }
}
