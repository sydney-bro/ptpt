// Get the environment configuration from .env file
//
// To make use of automatic environment setup:
// - Duplicate .env.example file and name it .env
// - Fill in the environment variables
import 'dotenv/config'

import 'hardhat-deploy'
import 'hardhat-contract-sizer'
import '@nomiclabs/hardhat-ethers'
import "@nomicfoundation/hardhat-verify";

import '@layerzerolabs/toolbox-hardhat'
import { HardhatUserConfig, HttpNetworkAccountsUserConfig } from 'hardhat/types'
import { EndpointId } from '@layerzerolabs/lz-definitions'
// import '../lz-genie/bin/hre';
import './tasks'

// Set your preferred authentication method
//
// If you prefer using a mnemonic, set a MNEMONIC environment variable
// to a valid mnemonic
const MNEMONIC = process.env.MNEMONIC

// If you prefer to be authenticated using a private key, set a PRIVATE_KEY environment variable
const PRIVATE_KEY = process.env.PRIVATE_KEY

const accounts: HttpNetworkAccountsUserConfig | undefined = MNEMONIC
    ? { mnemonic: MNEMONIC }
    : PRIVATE_KEY
        ? [PRIVATE_KEY]
        : undefined

if (accounts == null) {
    console.warn(
        'Could not find MNEMONIC or PRIVATE_KEY environment variables. It will not be possible to execute transactions in your example.'
    )
}

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: '0.8.22',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    networks: {
        polygon: {
            eid: EndpointId.POLYGON_V2_MAINNET,
            url: process.env.RPC_URL_POLYGON || 'https://polygon-rpc.com/',
            accounts,
        },
        zksync: {
            eid: EndpointId.ZKSYNC_V2_MAINNET,
            url: process.env.RPC_URL_ZKSYNC || 'https://mainnet.era.zksync.io',
            accounts,
        },
        base: {
            eid: EndpointId.BASE_V2_MAINNET,
            url: process.env.RPC_URL_BASE || 'https://mainnet.base.org',
            accounts,
        },
  
    },
    etherscan: {
        apiKey: {
          base: "3XR33RJ7S93796KX3MC54RRK2D8ZYCW2DB",
          polygon: "X7E5MM6Z7XNC1PB4KVJGBPQDFGVN9UB11G"
        },
      },
    namedAccounts: {
        deployer: {
            default: 0, // wallet address of index[0], of the mnemonic in .env
        },
    },
}

export default config
