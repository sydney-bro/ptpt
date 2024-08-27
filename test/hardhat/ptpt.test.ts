import { ethers } from 'hardhat'

import { Options } from '@layerzerolabs/lz-v2-utilities'
import { Address } from 'hardhat-deploy/types'

describe('ptpt_adapter_test', function () {

    const eidB = 30184
    let owner: Address
    let contractName = "ptpt_adapter_polygon"
    let contractAddress = "0xa1efa1afdcef2db851042c6c6fd4cffb8fbc7db0"

    // A test case to verify token transfer functionality
    it('should send a token from A address to B address via each OFT', async function () {

        owner = "0xF3FB5608C5FAF476E48fA3639224753AA51F440e"
        // Defining the amount of tokens to send and constructing the parameters for the send operation
        const tokensToSend = ethers.utils.parseEther('2000000')
        const tokensToReceive = ethers.utils.parseEther('500000')
        // Defining extra message execution options for the send operation
        const options = Options.newOptions().addExecutorLzReceiveOption(300000, 0).toHex().toString()

        const sendParam = [
            eidB,
            ethers.utils.zeroPad(owner, 32),
            tokensToSend,
            tokensToReceive,
            options,
            '0x',
            '0x',
        ]

        const myOFT = await ethers.getContractAt(contractName, contractAddress);
        // Fetching the native fee for the token send operation
        const [nativeFee] = await myOFT.quoteSend(sendParam, false)

        // Executing the send operation from myOFTA contract
        await myOFT.send(sendParam, [nativeFee, 0], owner, { value: nativeFee })

    })
})
