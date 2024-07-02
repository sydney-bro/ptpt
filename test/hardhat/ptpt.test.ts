import { ethers } from 'hardhat'

import { Options } from '@layerzerolabs/lz-v2-utilities'
import { Address } from 'hardhat-deploy/types'

describe('ptpt Test', function () {

    const eidB = 30184
    let owner: Address
    let contractAddress = "0x57Dd4Fea22E2344f6C7f6d3185C130c6B2E17a1C"

    // A test case to verify token transfer functionality
    it('should send a token from A address to B address via each OFT', async function () {

        owner = "0xF3FB5608C5FAF476E48fA3639224753AA51F440e"
        // Defining the amount of tokens to send and constructing the parameters for the send operation
        const tokensToSend = ethers.utils.parseEther('5000000')
        const tokensToReceive = ethers.utils.parseEther('2500000')
        // Defining extra message execution options for the send operation
        const options = Options.newOptions().addExecutorLzReceiveOption(200000, 0).toHex().toString()

        const sendParam = [
            eidB,
            ethers.utils.zeroPad(owner, 32),
            tokensToSend,
            tokensToReceive,
            options,
            '0x',
            '0x',
        ]

        const myOFT = await ethers.getContractAt("ptpt_adapter_polygon", contractAddress);
        // Fetching the native fee for the token send operation
        const [nativeFee] = await myOFT.quoteSend(sendParam, false)

        // Executing the send operation from myOFTA contract
        await myOFT.send(sendParam, [nativeFee, 0], owner, { value: nativeFee })

    })
})
