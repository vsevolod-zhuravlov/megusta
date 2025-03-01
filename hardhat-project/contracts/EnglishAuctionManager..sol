// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import {IEnglishAuctionManager} from "./interfaces/IEnglishAuctionManager.sol";
import {IERC721} from "./interfaces/token/IERC721.sol";
import {IERC20} from "./interfaces/token/IERC20.sol";
import {Helpers} from "./helpers/Helpers.sol";

contract EnglishAuctionManager is Helpers, IEnglishAuctionManager {
    mapping(address => mapping(uint => Auction)) public auctions;
    mapping(address => mapping(uint => bool)) public auctionGoingOn;
    mapping(address => mapping(uint => mapping(address => uint))) bidders;

    uint public constant MIN_DURATION = 3 minutes;

    struct Auction {
        uint duration;
        uint minStep;
        uint startedAt;
        uint endsAt;
        uint startingPrice;
        address erc20Token;
        address seller;
        uint highestBid;
        address highestBidder;
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
        uint _minStep,
        uint _startingPrice,
        address _erc20Token
    ) external {
        require(!auctionGoingOn[_nftContract][_tokenId], AuctionAlreadyGoingOn(_nftContract, _tokenId));
        require(_duration >= MIN_DURATION, LessThanMinDuration(_duration));
        require(_startingPrice > 0, StartingPriceCannotEqualZero());
        require(_minStep > 0, MinStepCannotEqualZero());

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
            minStep: _minStep,
            startedAt: block.timestamp,
            endsAt: block.timestamp + _duration,
            startingPrice: _startingPrice, 
            erc20Token: _erc20Token,
            seller: _seller,
            highestBid: 0,
            highestBidder: address(0)
        });

        auctions[_nftContract][_tokenId] = _auction;
        auctionGoingOn[_nftContract][_tokenId] = true;
        emit AuctionStarted(_nftContract, _tokenId, _seller);
    }

    function bid(address _nftContract, uint _tokenId) external payable {
        require(auctionGoingOn[_nftContract][_tokenId], AuctionNotGoing(_nftContract, _tokenId));

        Auction memory _auction = auctions[_nftContract][_tokenId];
        require(block.timestamp <= _auction.endsAt, AuctionNotGoing(_nftContract, _tokenId));

        address erc20Token = _auction.erc20Token;
        require(erc20Token == address(0), ThisFunctionOnlyForEtherBids());

        uint highestBid = _auction.highestBid;
        uint minStep = _auction.minStep;
        uint bidAmount = msg.value;

        if(highestBid == 0) {
            uint nextMinBid = _auction.startingPrice + minStep;
            require(bidAmount >= nextMinBid, GivenValueLessThanNextMinBid(bidAmount));
        } else {
            uint nextMinBid = highestBid + minStep;
            require(bidAmount >= nextMinBid, GivenValueLessThanNextMinBid(bidAmount));
            address highestBidder = _auction.highestBidder;
            bidders[_nftContract][_tokenId][highestBidder] += highestBid;
        }

        address bidder = msg.sender;

        _auction.highestBid = bidAmount;
        _auction.highestBidder = bidder;

        auctions[_nftContract][_tokenId] = _auction;

        emit BidSubmited(_nftContract, _tokenId, bidder, bidAmount);
    }

    function bid(address _nftContract, uint _tokenId, uint _tokensAmount) external {
        require(auctionGoingOn[_nftContract][_tokenId], AuctionNotGoing(_nftContract, _tokenId));

        Auction memory _auction = auctions[_nftContract][_tokenId];
        require(block.timestamp <= _auction.endsAt, AuctionNotGoing(_nftContract, _tokenId));

        address erc20Token = _auction.erc20Token;
        require(erc20Token != address(0), ThisFunctionOnlyForTokenBids());

        uint highestBid = _auction.highestBid;
        uint minStep = _auction.minStep;

        address bidder = msg.sender;

        if(highestBid == 0) {
            uint nextMinBid = _auction.startingPrice + minStep;
            require(_tokensAmount >= nextMinBid, GivenValueLessThanNextMinBid(_tokensAmount));
        } else {
            uint nextMinBid = highestBid + minStep;
            require(_tokensAmount >= nextMinBid, GivenValueLessThanNextMinBid(_tokensAmount));
            IERC20(erc20Token).transferFrom(bidder, address(this), _tokensAmount);

            address highestBidder = _auction.highestBidder;
            bidders[_nftContract][_tokenId][highestBidder] += highestBid;
        }

        _auction.highestBid = _tokensAmount;
        _auction.highestBidder = bidder;

        auctions[_nftContract][_tokenId] = _auction;

        emit BidSubmited(_nftContract, _tokenId, bidder, _tokensAmount);
    }

    function withdraw(address _nftContract, uint _tokenId) external lock {
        Auction memory _auction = auctions[_nftContract][_tokenId];

        address erc20Token = _auction.erc20Token;
        address account = msg.sender;
        uint balance = bidders[_nftContract][_tokenId][account];

        if(erc20Token == address(0)) {
            payable(account).transfer(balance);
        } else {
            IERC20(erc20Token).transfer(account, balance);
        }

        bidders[_nftContract][_tokenId][account] = 0;
    }

    function end(address _nftContract, uint _tokenId) external {
        require(auctionGoingOn[_nftContract][_tokenId], AuctionNotGoing(_nftContract, _tokenId));

        Auction memory _auction = auctions[_nftContract][_tokenId];
        require(block.timestamp >= _auction.endsAt, AuctionNotEndedYet(_nftContract, _tokenId));

        address seller = _auction.seller;
        address highestBidder = _auction.highestBidder;

        if(highestBidder != address(0)) {
            IERC721(_nftContract).transferFrom(address(this), highestBidder, _tokenId);
            uint highestBid = _auction.highestBid;
            address erc20Token = _auction.erc20Token;

            if(erc20Token == address(0)) {
                payable(seller).transfer(highestBid);
            } else {
                IERC20(erc20Token).transfer(seller, highestBid);
            }
        } else {
            IERC721(_nftContract).transferFrom(address(this), seller, _tokenId);
        }

        delete auctions[_nftContract][_tokenId];
        auctionGoingOn[_nftContract][_tokenId] = false;
        emit AuctionEnded(_nftContract, _tokenId, seller);
    }
}