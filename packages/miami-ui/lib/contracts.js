import {
  callReadOnlyFunction,
  standardPrincipalCV,
  uintCV,
} from "@syvita/transactions";
import {
  GENESIS_CONTRACT_ADDRESS,
  NETWORK,
  CITY_COIN_CORE_ADDRESS,
  CITY_COIN_CORE_CONTRACT_NAME,
  CITY_COIN_TOKEN_CONTRACT_NAME,
} from "./constants";

export async function getRegisteredMinerCount() {
  const result = await callReadOnlyFunction({
    contractAddress: CITY_COIN_CORE_ADDRESS,
    contractName: CITY_COIN_CORE_CONTRACT_NAME,
    functionName: "get-registered-users-nonce",
    functionArgs: [],
    network: NETWORK,
    senderAddress: GENESIS_CONTRACT_ADDRESS,
  });
  return parseInt(result.value);
}

export async function getRegisteredMinersThreshold() {
  const result = await callReadOnlyFunction({
    contractAddress: CITY_COIN_CORE_ADDRESS,
    contractName: CITY_COIN_CORE_CONTRACT_NAME,
    functionName: "get-activation-threshold",
    functionArgs: [],
    network: NETWORK,
    senderAddress: GENESIS_CONTRACT_ADDRESS,
  });
  return parseInt(result.value);
}

export async function getCoinBalance(address) {
  const result = await callReadOnlyFunction({
    contractAddress: CITY_COIN_CORE_ADDRESS,
    contractName: CITY_COIN_TOKEN_CONTRACT_NAME,
    functionName: "get-balance",
    functionArgs: [standardPrincipalCV(address)],
    network: NETWORK,
    senderAddress: address,
  });
  return result.value.value.words[0];
}

export async function canClaimMiningReward(address, minerBlockHeight) {
  const result = await callReadOnlyFunction({
    contractAddress: CITY_COIN_CORE_ADDRESS,
    contractName: CITY_COIN_CORE_CONTRACT_NAME,
    functionName: "is-block-winner",
    functionArgs: [standardPrincipalCV(address), uintCV(minerBlockHeight)],
    network: NETWORK,
    senderAddress: address,
  });
  console.log("WINNER? : " + JSON.stringify(result));
  return result.value;
}
