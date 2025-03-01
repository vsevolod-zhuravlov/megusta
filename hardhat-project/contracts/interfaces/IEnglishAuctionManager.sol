// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import {IAuctionManager} from "./IAuctionManager.sol";

interface IEnglishAuctionManager is IAuctionManager {
    event BidSubmited(
        address indexed contractAddress, 
        uint indexed tokenId, 
        address indexed bidder, 
        uint bid
    );

    error StartingPriceCannotEqualZero();
    error MinStepCannotEqualZero();

    error ThisFunctionOnlyForEtherBids();
    error ThisFunctionOnlyForTokenBids();

    error GivenValueLessThanNextMinBid(uint givenValue);

    error AuctionNotEndedYet(address nftContract, uint tokenId);
}