import { StacksMainnet, StacksTestnet } from "@stacks/network";

export var CC_NAME =
  process.env.STX_NETWORK == "mainnet" ? "miamicoin" : "citycoins";
export var CITY_COIN_CORE_ADDRESS =
  process.env.STX_NETWORK == "mainnet"
    ? "SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27"
    : "ST3CK642B6119EVC6CT550PW5EZZ1AJW6608HK60A";
export var CITY_COIN_CORE_CONTRACT_NAME =
  process.env.STX_NETWORK == "mainnet"
    ? "miamicoin-core-v1"
    : "citycoin-core-v4";
export var CITY_COIN_TOKEN_CONTRACT_NAME =
  process.env.STX_NETWORK == "mainnet" ? "miamicoin-token" : "citycoin-token";
export var GENESIS_CONTRACT_ADDRESS =
  process.env.STX_NETWORK == "mainnet"
    ? "SP000000000000000000002Q6VF78"
    : "ST000000000000000000002AMW42H";
export var NETWORK =
  process.env.STX_NETWORK == "mainnet"
    ? new StacksMainnet()
    : new StacksTestnet();
export var API_BASE_NET_URL =
  process.env.STX_NETWORK == "mainnet"
    ? "https://stacks-node-api.stacks.co/"
    : "https://stacks-node-api.testnet.stacks.co/";
export var NETWORK_STRING =
  process.env.STX_NETWORK == "mainnet" ? "mainnet" : "testnet";
