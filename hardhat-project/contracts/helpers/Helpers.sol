// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import {IERC20} from "../interfaces/token/IERC20.sol";

contract Helpers {
    function isContract(address account) internal view returns (bool) {
        uint size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }

    function isErc20Token(address account) internal view returns (bool) {
        (bool success, ) = account.staticcall(abi.encodeWithSelector(IERC20.totalSupply.selector));
        return success;
    }
}