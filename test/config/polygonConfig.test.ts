import { ethers } from 'hardhat'

import { Options } from '@layerzerolabs/lz-v2-utilities'
import { Address } from 'hardhat-deploy/types'

describe('ptpt_pol_zk_config_test', function () {

    let contractAddress = "0x1a44076050125825900e736c501f859c50fE728c"

    const sendConfig = ethers.utils.defaultAbiCoder.encode(
        ["tuple(uint64,uint8,uint8,uint8,address[],address[])"],
        [[
          512,
          1, // uint8
          0, // uint8
          0, // uint8
          ["0x23de2fe932d9043291f870324b74f820e11dc81a"], // address[]
          [],
        ]]
      );

      const receiveConfig = ethers.utils.defaultAbiCoder.encode(
        ["tuple(uint64,uint8,uint8,uint8,address[],address[])"],
        [[
          20,
          1, // uint8
          0, // uint8
          0, // uint8
          ["0x23de2fe932d9043291f870324b74f820e11dc81a"], // address[]
          [],
        ]]
      );

      const endpointAbi = [
        'function setConfig(address oappAddress, address sendLibAddress, tuple(uint32 eid, uint32 configType, bytes config)[] setConfigParams) external',
      ];
    // A test case to verify token transfer functionality
    it('should send a token from A address to B address via each OFT', async function () {

        //owner = "0xF3FB5608C5FAF476E48fA3639224753AA51F440e"

        const [owner, addr1] = await ethers.getSigners();

        const contract = new ethers.Contract(contractAddress,endpointAbi,owner);
        if(contract) {
            //const tx = await contract.setConfig('0x67e6BA651Edcf8681766dDCbFD836FBe430adB7A','0x6c26c61a97006888ea9E4FA36584c7df57Cd9dA3',[{eid:30165,configType: 2,config: sendConfig}]);
            const tx = await contract.setConfig('0x67e6BA651Edcf8681766dDCbFD836FBe430adB7A','0x1322871e4ab09Bc7f5717189434f97bBD9546e95',[{eid:30165,configType: 2,config: receiveConfig}]);
            console.log('Transaction sent: ' + tx.hash);
            const receipt = await tx.wait();
            console.log('Transaction confirmed: ' + receipt);
          }
          else {
            console.log('Some problem with contract initialization');
        }
    })
})


