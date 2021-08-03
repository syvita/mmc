import { StacksMainnet, StacksTestnet } from "@stacks/network";

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

export const CC_NAME = process.env.CC_NAME || "citycoins";
export const CITY_COIN_CORE_ADDRESS =
  process.env.CITY_COIN_CORE_ADDRESS ||
  "ST3CK642B6119EVC6CT550PW5EZZ1AJW6608HK60A";
export const CITY_COIN_CORE_CONTRACT_NAME =
  process.env.CITY_COIN_CORE_CONTRACT_NAME || "citycoin-core-v4";

export const CITY_COIN_TOKEN_CONTRACT_NAME =
  process.env.CITY_COIN_TOKEN_CONTRACT_NAME || "citycoin-token";
export const GENESIS_CONTRACT_ADDRESS =
  process.env.GENESIS_CONTRACT_ADDRESS || "ST000000000000000000002AMW42H";
export const NETWORK = getNetwork();
export const API_BASE_NET_URL = getApiNetUrl();
export const NETWORK_STRING = getNetworkString();
