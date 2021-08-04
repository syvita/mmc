import { StacksMainnet, StacksTestnet } from "@stacks/network";

/*
function getNetwork() {
  if (process.env.STX_NETWORK == "mainnet") {
    return new StacksMainnet();
  } else {
    return new StacksTestnet();
  }
}

function getApiNetUrl() {
  if (process.env.STX_NETWORK == "mainnet") {
    return "https://stacks-node-api.stacks.co/";
  } else {
    return "https://stacks-node-api.testnet.stacks.co/";
  }
}

function getNetworkString() {
  if (process.env.STX_NETWORK == "mainnet") {
    return "mainnet";
  } else {
    return "testnet";
  }
}
*/

export const CC_NAME = 'miamicoin'

export const CITY_COIN_CORE_ADDRESS = 'SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27'

export const CITY_COIN_CORE_CONTRACT_NAME = 'miamicoin-core-v1'

export const CITY_COIN_TOKEN_CONTRACT_NAME = 'miamicoin-token'

export const GENESIS_CONTRACT_ADDRESS = 'SP000000000000000000002Q6VF78'

export const NETWORK = new StacksMainnet()
export const API_BASE_NET_URL = 'https://stacks-node-api.stacks.co/'
export const NETWORK_STRING = 'mainnet'

console.log()

