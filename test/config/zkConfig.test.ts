import { ethers } from 'hardhat'

import { Options } from '@layerzerolabs/lz-v2-utilities'
import { Address } from 'hardhat-deploy/types'

describe('ptpt_zk_config_test', function () {

    let contractAddress = "0xd07C30aF3Ff30D96BDc9c6044958230Eb797DDBF"

    const sendConfig = ethers.utils.defaultAbiCoder.encode(
        ["tuple(uint64,uint8,uint8,uint8,address[],address[])"],
        [[
          20,
          1, // uint8
          0, // uint8
          0, // uint8
          ["0x620a9df73d2f1015ea75aea1067227f9013f5c51"], // address[]
          [],
        ]]
      );
      const receiveConfig = ethers.utils.defaultAbiCoder.encode(
        ["tuple(uint64,uint8,uint8,uint8,address[],address[])"],
        [[
          10,
          1, // uint8
          0, // uint8
          0, // uint8
          ["0x620a9df73d2f1015ea75aea1067227f9013f5c51"], // address[]
          [],
        ]]
      );
      const endpointAbi = [
        'function setConfig(address oappAddress, address sendLibAddress, tuple(uint32 eid, uint32 configType, bytes config)[] setConfigParams) external',
      ];
    // A test case to verify token transfer functionality
    it('Setting DVN configuration...', async function () {

        const [owner, addr1] = await ethers.getSigners();

        const contract = new ethers.Contract(contractAddress,endpointAbi,owner);
        if(contract) {
            //const tx = await contract.setConfig('0xFD21D5E148dF3B93AE6deC416544Fb3d3E21260C','0x07fD0e370B49919cA8dA0CE842B8177263c0E12c',[{eid:30184,configType: 2,config: sendConfig}]);
            const tx = await contract.setConfig('0xFD21D5E148dF3B93AE6deC416544Fb3d3E21260C','0x04830f6deCF08Dec9eD6C3fCAD215245B78A59e1',[{eid:30184,configType: 2,config: receiveConfig}]);
            console.log('Transaction sent: ' + tx.hash);
            const receipt = await tx.wait();
            console.log('Transaction confirmed: ' + receipt);
          }
          else {
            console.log('Some problem with contract initialization');
        }
    })
})

describe('ptpt_zk_setlibs_test', function () {
//not required
  let contractAddress = "0xd07C30aF3Ff30D96BDc9c6044958230Eb797DDBF"
  const remoteEid = 30184;
  const endpointAbi = [
    'function setSendLibrary(address oapp, uint32 eid, address sendLib) external',
    'function setReceiveLibrary(address oapp, uint32 eid, address receiveLib) external',
  ];
  // A test case to verify token transfer functionality
  it('should send a token from A address to B address via each OFT', async function () {

      const [owner, addr1] = await ethers.getSigners();

      const contract = new ethers.Contract(contractAddress,endpointAbi,owner);
      if(contract) {
          
          console.log("Setting send library...");
          const sendLibTx = await contract.setSendLibrary('0xFD21D5E148dF3B93AE6deC416544Fb3d3E21260C',remoteEid,'0x07fD0e370B49919cA8dA0CE842B8177263c0E12c');
          console.log('Transaction sent: ' + sendLibTx.hash);
          const receiptSend = await sendLibTx.wait();
          console.log('Transaction confirmed: ' + receiptSend);
          console.log("Setting receive library...");
          const receiveLibTx = await contract.setReceiveLibrary('0xFD21D5E148dF3B93AE6deC416544Fb3d3E21260C',remoteEid,'0x04830f6deCF08Dec9eD6C3fCAD215245B78A59e1');
          console.log('Transaction sent: ' + receiveLibTx.hash);
          const receiptReceive = await receiveLibTx.wait();
          console.log('Transaction confirmed: ' + receiptReceive);
        }
        else {
          console.log('Some problem with contract initialization');
      }
  })
})

describe('ptpt_zk_setExecutor_test', function () {

  let contractAddress = "0xd07C30aF3Ff30D96BDc9c6044958230Eb797DDBF"
  const endpointAbi = [
    'function setConfig(address oappAddress, address sendLibAddress, tuple(uint32 eid, uint32 configType, bytes config)[] setConfigParams) external',
  ];

  const executorConfig = {
    maxMessageSize: 1000000, // Example value, replace with actual
    executorAddress: '0x664e390e672A811c12091db8426cBb7d68D5D8A6', // Replace with the actual executor address
  };
  const configTypeExecutorStruct = 'tuple(uint32 maxMessageSize, address executorAddress)';
  const encodedExecutorConfig = ethers.utils.defaultAbiCoder.encode(
    [configTypeExecutorStruct],
    [executorConfig],
  );
  const setConfigParamExecutor = {
    eid: 30184,
    configType: 1, // EXECUTOR_CONFIG_TYPE
    config: encodedExecutorConfig,
  };
  // A test case to verify token transfer functionality
  it('Set executor on zk', async function () {

      const [owner, addr1] = await ethers.getSigners();

      const contract = new ethers.Contract(contractAddress,endpointAbi,owner);
      if(contract) {
          
          console.log("Setting executor library...");
          const tx = await contract.setConfig(
            '0xFD21D5E148dF3B93AE6deC416544Fb3d3E21260C',
            '0x07fD0e370B49919cA8dA0CE842B8177263c0E12c',
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


//zksync <-> Polygon config
describe('ptpt_zk_pol_config_test', function () {

    let contractAddress = "0xd07C30aF3Ff30D96BDc9c6044958230Eb797DDBF"

    const sendConfig = ethers.utils.defaultAbiCoder.encode(
        ["tuple(uint64,uint8,uint8,uint8,address[],address[])"],
        [[
          20,
          1, // uint8
          0, // uint8
          0, // uint8
          ["0x620a9df73d2f1015ea75aea1067227f9013f5c51"], // address[]
          [],
        ]]
      );
      const receiveConfig = ethers.utils.defaultAbiCoder.encode(
        ["tuple(uint64,uint8,uint8,uint8,address[],address[])"],
        [[
          512,
          1, // uint8
          0, // uint8
          0, // uint8
          ["0x620a9df73d2f1015ea75aea1067227f9013f5c51"], // address[]
          [],
        ]]
      );
      const endpointAbi = [
        'function setConfig(address oappAddress, address sendLibAddress, tuple(uint32 eid, uint32 configType, bytes config)[] setConfigParams) external',
      ];
    // A test case to verify token transfer functionality
    it('Setting DVN configuration...', async function () {

        const [owner, addr1] = await ethers.getSigners();

        const contract = new ethers.Contract(contractAddress,endpointAbi,owner);
        if(contract) {
            //const tx = await contract.setConfig('0xFD21D5E148dF3B93AE6deC416544Fb3d3E21260C','0x07fD0e370B49919cA8dA0CE842B8177263c0E12c',[{eid:30109,configType: 2,config: sendConfig}]);
            const tx = await contract.setConfig('0xFD21D5E148dF3B93AE6deC416544Fb3d3E21260C','0x04830f6deCF08Dec9eD6C3fCAD215245B78A59e1',[{eid:30109,configType: 2,config: receiveConfig}]);
            console.log('Transaction sent: ' + tx.hash);
            const receipt = await tx.wait();
            console.log('Transaction confirmed: ' + receipt);
          }
          else {
            console.log('Some problem with contract initialization');
        }
    })
})

describe('ptpt_zk_pol_setlibs_test', function () {
//not required
  let contractAddress = "0xd07C30aF3Ff30D96BDc9c6044958230Eb797DDBF"
  const remoteEid = 30109;
  const endpointAbi = [
    'function setSendLibrary(address oapp, uint32 eid, address sendLib) external',
    'function setReceiveLibrary(address oapp, uint32 eid, address receiveLib) external',
  ];
  // A test case to verify token transfer functionality
  it('should send a token from A address to B address via each OFT', async function () {

      const [owner, addr1] = await ethers.getSigners();

      const contract = new ethers.Contract(contractAddress,endpointAbi,owner);
      if(contract) {
          
          console.log("Setting send library...");
          const sendLibTx = await contract.setSendLibrary('0xFD21D5E148dF3B93AE6deC416544Fb3d3E21260C',remoteEid,'0x07fD0e370B49919cA8dA0CE842B8177263c0E12c');
          console.log('Transaction sent: ' + sendLibTx.hash);
          const receiptSend = await sendLibTx.wait();
          console.log('Transaction confirmed: ' + receiptSend);
          console.log("Setting receive library...");
          const receiveLibTx = await contract.setReceiveLibrary('0xFD21D5E148dF3B93AE6deC416544Fb3d3E21260C',remoteEid,'0x04830f6deCF08Dec9eD6C3fCAD215245B78A59e1');
          console.log('Transaction sent: ' + receiveLibTx.hash);
          const receiptReceive = await receiveLibTx.wait();
          console.log('Transaction confirmed: ' + receiptReceive);
        }
        else {
          console.log('Some problem with contract initialization');
      }
  })
})

describe('ptpt_zk_pol_setExecutor_test', function () {

  let contractAddress = "0xd07C30aF3Ff30D96BDc9c6044958230Eb797DDBF"
  const endpointAbi = [
    'function setConfig(address oappAddress, address sendLibAddress, tuple(uint32 eid, uint32 configType, bytes config)[] setConfigParams) external',
  ];

  const executorConfig = {
    maxMessageSize: 100000, // Example value, replace with actual
    executorAddress: '0x664e390e672A811c12091db8426cBb7d68D5D8A6', // Replace with the actual executor address
  };
  const configTypeExecutorStruct = 'tuple(uint32 maxMessageSize, address executorAddress)';
  const encodedExecutorConfig = ethers.utils.defaultAbiCoder.encode(
    [configTypeExecutorStruct],
    [executorConfig],
  );
  const setConfigParamExecutor = {
    eid: 30109,
    configType: 1, // EXECUTOR_CONFIG_TYPE
    config: encodedExecutorConfig,
  };
  // A test case to verify token transfer functionality
  it('Set executor on zk', async function () {

      const [owner, addr1] = await ethers.getSigners();

      const contract = new ethers.Contract(contractAddress,endpointAbi,owner);
      if(contract) {
          
          console.log("Setting executor library...");
          const tx = await contract.setConfig(
            '0xFD21D5E148dF3B93AE6deC416544Fb3d3E21260C',
            '0x07fD0e370B49919cA8dA0CE842B8177263c0E12c',
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