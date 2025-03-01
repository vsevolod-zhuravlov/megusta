// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

interface IAuctionManager {
    event AuctionStarted(address indexed contractAddress, uint indexed tokenId, address indexed seller);
    event AuctionEnded(address indexed contractAddress, uint indexed tokenId, address indexed seller);

    error Locked();
    
    error AuctionAlreadyGoingOn(address nftContract, uint tokenId);
    error AuctionNotGoing(address nftContract, uint tokenId);

    error LessThanMinDuration(uint duration);

    error GivenAccountIsNotContract(address account);
    error GivenAccountIsNotErc20Token(address account);

    error YouAreNotAnOwner(uint tokenId);

    error NotEnoughEthersToBuy(uint givenValue);
}