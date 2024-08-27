import { ethers } from 'hardhat'

import { Options } from '@layerzerolabs/lz-v2-utilities'
import { Address } from 'hardhat-deploy/types'

describe('ptpt_base_test', function () {

    const eidB = 30109
    let owner: Address
    let contractName = "ptpt_base"
    let contractAddress = "0x9c6d4496bDc6312AB94F1FD4295F59DF6Ed8EeE3"

    // A test case to verify token transfer functionality
    it('should send a token from A address to B address via each OFT', async function () {

        owner = "0xF3FB5608C5FAF476E48fA3639224753AA51F440e"
        // Defining the amount of tokens to send and constructing the parameters for the send operation
        const tokensToSend = ethers.utils.parseEther('2500000')
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

        const myOFT = await ethers.getContractAt(contractName, contractAddress);
        // Fetching the native fee for the token send operation
        const [nativeFee] = await myOFT.quoteSend(sendParam, false)

        // Executing the send operation from myOFTA contract
        await myOFT.send(sendParam, [nativeFee, 0], owner, { value: nativeFee })

    })
})