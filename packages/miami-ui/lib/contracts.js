import {
  callReadOnlyFunction,
  standardPrincipalCV,
  uintCV,
  ClarityType,
} from "@syvita/transactions";
import {
  GENESIS_CONTRACT_ADDRESS,
  NETWORK,
  CITY_COIN_CORE_ADDRESS,
  CITY_COIN_CORE_CONTRACT_NAME,
  CITY_COIN_TOKEN_CONTRACT_NAME,
  ACCOUNTS_API,
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

export async function getActivationStatus() {
  const result = await callReadOnlyFunction({
    contractAddress: CITY_COIN_CORE_ADDRESS,
    contractName: CITY_COIN_CORE_CONTRACT_NAME,
    functionName: "get-activation-status",
    functionArgs: [],
    network: NETWORK,
    senderAddress: GENESIS_CONTRACT_ADDRESS,
  });
  console.log(`ACTIVATION STATUS:  ${result.type !== ClarityType.BoolTrue}`);
  return result.type !== ClarityType.BoolTrue;
}

export async function getActivationBlock(address) {
  const result = await callReadOnlyFunction({
    contractAddress: CITY_COIN_CORE_ADDRESS,
    contractName: CITY_COIN_CORE_CONTRACT_NAME,
    functionName: "get-activation-block",
    functionArgs: [],
    network: NETWORK,
    senderAddress: address,
  });
  const json = JSON.stringify(result, (key, value) =>
    typeof value === "bigint" ? value.toString() + "n" : value
  );
  console.log("Activation block : " + json);
  console.log("Activation block : " + json.value);
  console.log("Activation block : " + json.type);
  console.log("Activation block : " + json[0]);
  return result.value.value;
}

export async function canClaimMiningReward(address, minerBlockHeight) {
  const result = await callReadOnlyFunction({
    contractAddress: CITY_COIN_CORE_ADDRESS,
    contractName: CITY_COIN_CORE_CONTRACT_NAME,
    functionName: "can-claim-mining-reward",
    functionArgs: [standardPrincipalCV(address), uintCV(minerBlockHeight)],
    network: NETWORK,
    senderAddress: address,
  });
  return result.type == ClarityType.BoolTrue;
}
