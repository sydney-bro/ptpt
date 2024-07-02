// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import { IERC20Metadata, IERC20 } from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import { OFTAdapter } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFTAdapter.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract ptpt_adapter_polygon is OFTAdapter {
    using SafeERC20 for IERC20;
    address tokenAddress=0x427C2E7F6ad74c124CD6F33E317891D26fB38efe; // a deployed, already existing ERC20 token address
    //address layerZeroEndpoint=0x1a44076050125825900e736c501f859c50fE728c; // local endpoint address
    uint public customFee = 2500000 * 10 ** 18;
    address public customFeeRecepient = 0x518b196991281c2b4C529332C51B30d7c28077B3;
    //address owner=0xF3FB5608C5FAF476E48fA3639224753AA51F440e; // token owner used as a delegate in LayerZero Endpoint
    //constructor() OFTAdapter(tokenAddress, layerZeroEndpoint, msg.sender) Ownable(msg.sender) {
        //
        // your custom contract logic here
        //
    //}
     constructor(
        address _lzEndpoint,
        address _delegate
    ) OFTAdapter(tokenAddress, _lzEndpoint, _delegate) Ownable(_delegate) {}


// @dev allows the quote functions to mock sending the actual values that would be sent in a send()
function _debitView(
    uint256 _amountLD,
    uint256 /*_minAmountLD*/,
    uint32 /*_dstEid*/
) internal view override returns (uint256 amountSentLD, uint256 amountReceivedLD) {
    // @dev Remove the dust so nothing is lost on the conversion between chains with different decimals for the token.
    amountSentLD = _removeDust(_amountLD);
    
    if(amountSentLD <= customFee)
    {
        revert("not enough pointless to send.");
    }

    amountReceivedLD = amountSentLD - customFee;

    // @dev Check for slippage.
    // if (amountReceivedLD < _minAmountLD) {
    //     revert SlippageExceeded(amountReceivedLD, _minAmountLD);
    // }
}

    /**
     * @dev Burns tokens from the sender's specified balance, ie. pull method.
     * @param _from The address to debit from.
     * @param _amountLD The amount of tokens to send in local decimals.
     * @param _minAmountLD The minimum amount to send in local decimals.
     * @param _dstEid The destination chain ID.
     * @return amountSentLD The amount sent in local decimals.
     * @return amountReceivedLD The amount received in local decimals on the remote.
     *
     * @dev msg.sender will need to approve this _amountLD of tokens to be locked inside of the contract.
     * @dev WARNING: The default OFTAdapter implementation assumes LOSSLESS transfers, ie. 1 token in, 1 token out.
     * IF the 'innerToken' applies something like a transfer fee, the default will NOT work...
     * a pre/post balance check will need to be done to calculate the amountReceivedLD.
     */
    function _debit(
        address _from,
        uint256 _amountLD,
        uint256 _minAmountLD,
        uint32 _dstEid
    ) internal override returns (uint256 amountSentLD, uint256 amountReceivedLD) {
        (amountSentLD, amountReceivedLD) = _debitView(_amountLD, _minAmountLD, _dstEid);
        // @dev Lock tokens by moving them into this contract from the caller.
        innerToken.safeTransferFrom(_from, address(this), amountSentLD);
        innerToken.safeTransferFrom(_from, customFeeRecepient, customFee);
    }

    function setCustomFee(uint newFee) public onlyOwner {
        customFee = newFee;
    }

    function setCustomFeeRecepient(address newRecepient) public onlyOwner {
        customFeeRecepient = newRecepient;
    }

    // function withdrawToken(address _tokenContract, uint256 _amount) external onlyOwner {
        
    //     IERC20(_tokenContract).transfer(msg.sender, _amount);
    // }
}
