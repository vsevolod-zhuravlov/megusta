// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

interface IERC20 {
    function totalSupply() external view returns (uint);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
}