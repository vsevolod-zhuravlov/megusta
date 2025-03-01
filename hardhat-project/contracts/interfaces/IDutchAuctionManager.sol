// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import {IAuctionManager} from "./IAuctionManager.sol";

interface IDutchAuctionManager is IAuctionManager {
    error NegativePricePossibility(uint startingPrice);

    error AuctionNotEndedYet(address nftContract, uint tokenId);

    error OnlySeller();
}