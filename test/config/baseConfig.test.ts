import { ethers } from 'hardhat'

import { Options } from '@layerzerolabs/lz-v2-utilities'
import { Address } from 'hardhat-deploy/types'

describe('ptpt_base_config_test', function () {

    let contractAddress = "0x1a44076050125825900e736c501f859c50fE728c"

    const sendConfig = ethers.utils.defaultAbiCoder.encode(
        ["tuple(uint64,uint8,uint8,uint8,address[],address[])"],
        [[
          10,
          1, // uint8
          0, // uint8
          0, // uint8
          ["0x9e059a54699a285714207b43b055483e78faac25"], // address[]
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
          ["0x9e059a54699a285714207b43b055483e78faac25"], // address[]
          [],
        ]]
      );
      const endpointAbi = [
        'function setConfig(address oappAddress, address sendLibAddress, tuple(uint32 eid, uint32 configType, bytes config)[] setConfigParams) external',
      ];
    // A test case to verify token transfer functionality
    it('should send a token from A address to B address via each OFT', async function () {

        const [owner, addr1] = await ethers.getSigners();

        const contract = new ethers.Contract(contractAddress,endpointAbi,owner);
        if(contract) {
            //const tx = await contract.setConfig('0xaF13924f23Be104b96c6aC424925357463b0d105','0xB5320B0B3a13cC860893E2Bd79FCd7e13484Dda2',[{eid:30165,configType: 2,config: sendConfig}]);
            const tx = await contract.setConfig('0xaF13924f23Be104b96c6aC424925357463b0d105','0xc70AB6f32772f59fBfc23889Caf4Ba3376C84bAf',[{eid:30165,configType: 2,config: receiveConfig}]);
            console.log('Transaction sent: ' + tx.hash);
            const receipt = await tx.wait();
            console.log('Transaction confirmed: ' + receipt);
          }
          else {
            console.log('Some problem with contract initialization');
        }
    })
})

describe('ptpt_base_setlibs_test', function () {

  let contractAddress = "0x1a44076050125825900e736c501f859c50fE728c"
  const remoteEid = 30165;
  const endpointAbi = [
    'function setSendLibrary(address oapp, uint32 eid, address sendLib) external',
    'function setReceiveLibrary(address oapp, uint32 eid, address receiveLib) external',
  ];
  // A test case to verify token transfer functionality
  it('Set send and receive libraries on base', async function () {

      const [owner, addr1] = await ethers.getSigners();

      const contract = new ethers.Contract(contractAddress,endpointAbi,owner);
      if(contract) {
          
          console.log("Setting send library...");
          const sendLibTx = await contract.setSendLibrary('0xaF13924f23Be104b96c6aC424925357463b0d105',remoteEid,'0xB5320B0B3a13cC860893E2Bd79FCd7e13484Dda2');
          console.log('Transaction sent: ' + sendLibTx.hash);
          const receiptSend = await sendLibTx.wait();
          console.log('Transaction confirmed: ' + receiptSend);
          console.log("Setting receive library...");
          const receiveLibTx = await contract.setReceiveLibrary('0xaF13924f23Be104b96c6aC424925357463b0d105',remoteEid,'0xc70AB6f32772f59fBfc23889Caf4Ba3376C84bAf');
          console.log('Transaction sent: ' + receiveLibTx.hash);
          const receiptReceive = await receiveLibTx.wait();
          console.log('Transaction confirmed: ' + receiptReceive);
        }
        else {
          console.log('Some problem with contract initialization');
      }
  })
})

describe('ptpt_base_setExecutor_test', function () {

  let contractAddress = "0x1a44076050125825900e736c501f859c50fE728c"
  const endpointAbi = [
    'function setConfig(address oappAddress, address sendLibAddress, tuple(uint32 eid, uint32 configType, bytes config)[] setConfigParams) external',
  ];

  const executorConfig = {
    maxMessageSize: 1000000, // Example value, replace with actual
    executorAddress: '0x2CCA08ae69E0C44b18a57Ab2A87644234dAebaE4', // Replace with the actual executor address
  };
  const configTypeExecutorStruct = 'tuple(uint32 maxMessageSize, address executorAddress)';
  const encodedExecutorConfig = ethers.utils.defaultAbiCoder.encode(
    [configTypeExecutorStruct],
    [executorConfig],
  );
  const setConfigParamExecutor = {
    eid: 30165,
    configType: 1, // EXECUTOR_CONFIG_TYPE
    config: encodedExecutorConfig,
  };
  // A test case to verify token transfer functionality
  it('Set executor on base', async function () {

      const [owner, addr1] = await ethers.getSigners();

      const contract = new ethers.Contract(contractAddress,endpointAbi,owner);
      if(contract) {
          
          //console.log("Setting send library...");
          //const sendLibTx = await contract.setSendLibrary('0x9c6d4496bDc6312AB94F1FD4295F59DF6Ed8EeE3',remoteEid,'0xB5320B0B3a13cC860893E2Bd79FCd7e13484Dda2');
          //console.log('Transaction sent: ' + sendLibTx.hash);
          //const receiptSend = await sendLibTx.wait();
          //console.log('Transaction confirmed: ' + receiptSend);
          console.log("Setting executor library...");
          const tx = await contract.setConfig(
            '0xaF13924f23Be104b96c6aC424925357463b0d105',
            '0xB5320B0B3a13cC860893E2Bd79FCd7e13484Dda2',
            [setConfigParamExecutor], // Array of SetConfigParam structs
          );
          console.log('Transaction sent: ' + tx.hash);
          const receipt = await tx.wait();
          console.log('Transaction confirmed: ' + receipt);
        }
        else {
          console.log('Some problem with contract initialization');
      }
  })
})