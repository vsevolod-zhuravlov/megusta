// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import {IDutchAuctionManager} from "./interfaces/IDutchAuctionManager.sol";
import {IERC721} from "./interfaces/token/IERC721.sol";
import {IERC20} from "./interfaces/token/IERC20.sol";
import {Helpers} from "./helpers/Helpers.sol";

contract DutchAuctionManager is Helpers, IDutchAuctionManager {
    mapping(address => mapping(uint => Auction)) public auctions;
    mapping(address => mapping(uint => bool)) public auctionGoingOn;

    uint public constant MIN_DURATION = 3 minutes;

    struct Auction {
        uint duration;
        uint discountRate;
        uint startedAt;
        uint endsAt;
        uint startingPrice;
        address erc20Token;
        address seller;
    }

    bool unlocked = true;
    modifier lock() {
        require(unlocked, Locked());
        unlocked = false;
        _;
        unlocked = true;
    }

    function start(
        address _nftContract,
        uint _tokenId,
        uint _duration,
        uint _discountRate,
        uint _startingPrice,
        address _erc20Token
    ) external {
        require(!auctionGoingOn[_nftContract][_tokenId], AuctionAlreadyGoingOn(_nftContract, _tokenId));
        require(_duration >= MIN_DURATION, LessThanMinDuration(_duration));
        require(_discountRate * _duration < _startingPrice, NegativePricePossibility(_startingPrice));

        if(_erc20Token != address(0)) {
            require(isContract(_erc20Token), GivenAccountIsNotContract(_erc20Token));
            require(isErc20Token(_erc20Token), GivenAccountIsNotErc20Token(_erc20Token));
        }

        address _seller = msg.sender;

        IERC721 nftContract = IERC721(_nftContract);
        require(nftContract.ownerOf(_tokenId) == _seller, YouAreNotAnOwner(_tokenId));
        nftContract.transferFrom(_seller, address(this), _tokenId);

        Auction memory _auction = Auction({
            duration: _duration,
            discountRate: _discountRate,
            startedAt: block.timestamp,
            endsAt: block.timestamp + _duration,
            startingPrice: _startingPrice,
            erc20Token: _erc20Token,
            seller: _seller
        });

        auctions[_nftContract][_tokenId] = _auction;
        auctionGoingOn[_nftContract][_tokenId] = true;
        emit AuctionStarted(_nftContract, _tokenId, _seller);
    }

    function getPrice(address _nftContract, uint _tokenId) public view returns (uint) {
        Auction memory _auction = auctions[_nftContract][_tokenId];

        uint timeElapsed = block.timestamp - _auction.startedAt;
        uint discountRate = _auction.discountRate;
        uint startingPrice = _auction.startingPrice;

        uint discount = discountRate * timeElapsed;
        return startingPrice - discount;
    }

    function buy(address _nftContract, uint _tokenId) external payable lock {
        require(auctionGoingOn[_nftContract][_tokenId], AuctionNotGoing(_nftContract, _tokenId));

        Auction memory _auction = auctions[_nftContract][_tokenId];
        require(block.timestamp <= _auction.endsAt, AuctionNotGoing(_nftContract, _tokenId));
        address seller = _auction.seller;
        address erc20Token = _auction.erc20Token;

        IERC721 nftContract = IERC721(_nftContract);
        uint price = getPrice(_nftContract, _tokenId);

        if(_auction.erc20Token == address(0)) {
            require(msg.value >= price, NotEnoughEthersToBuy(msg.value));

            nftContract.transferFrom(address(this), msg.sender, _tokenId);
            payable(seller).transfer(price);

            uint refund = msg.value - price;

            if (refund > 0) {
                payable(msg.sender).transfer(refund);
            }
        } else {
            IERC20(erc20Token).transferFrom(msg.sender, seller, price);
            nftContract.transferFrom(address(this), msg.sender, _tokenId);
        }

        delete auctions[_nftContract][_tokenId];
        auctionGoingOn[_nftContract][_tokenId] = false;
        emit AuctionEnded(_nftContract, _tokenId, seller);
    }

    function end(address _nftContract, uint _tokenId) external {
        require(auctionGoingOn[_nftContract][_tokenId], AuctionNotGoing(_nftContract, _tokenId));

        Auction memory _auction = auctions[_nftContract][_tokenId];
        require(block.timestamp >= _auction.endsAt, AuctionNotEndedYet(_nftContract, _tokenId));
        address seller = _auction.seller;

        IERC721(_nftContract).transferFrom(address(this), seller, _tokenId);

        delete auctions[_nftContract][_tokenId];
        auctionGoingOn[_nftContract][_tokenId] = false;
        emit AuctionEnded(_nftContract, _tokenId, seller);
    }
}