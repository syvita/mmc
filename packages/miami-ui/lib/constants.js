import { StacksMainnet, StacksTestnet } from "@stacks/network";

if (process.env.STX_NETWORK == 'mainnet') {
  export var CC_NAME = 'miamicoin'
  export var CITY_COIN_CORE_ADDRESS = 'SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27'
  export var CITY_COIN_CORE_CONTRACT_NAME = 'miamicoin-core-v1'
  export var CITY_COIN_TOKEN_CONTRACT_NAME = 'miamicoin-token'
  export var GENESIS_CONTRACT_ADDRESS = 'SP000000000000000000002Q6VF78'
  export var NETWORK = new StacksMainnet()
  export var API_BASE_NET_URL = 'https://stacks-node-api.stacks.co/'
  export var NETWORK_STRING = 'mainnet'
} else {
  export var CC_NAME = 'citycoins'
  export var CITY_COIN_CORE_ADDRESS = 'ST3CK642B6119EVC6CT550PW5EZZ1AJW6608HK60A'
  export var CITY_COIN_CORE_CONTRACT_NAME = 'citycoin-core-v4'
  export var CITY_COIN_TOKEN_CONTRACT_NAME = 'citycoin-token'
  export var GENESIS_CONTRACT_ADDRESS = 'ST000000000000000000002AMW42H'
  export var NETWORK = new StacksTestnet()
  export var API_BASE_NET_URL = 'https://stacks-node-api.testnet.stacks.co/'
  export var NETWORK_STRING = 'testnet'
}
