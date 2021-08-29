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
  NETWORK_STRING,
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

export async function getUserId(STXAddress) {
  console.log('STX ADDRESS: ' + STXAddress)
  const result = await callReadOnlyFunction({
    contractAddress: CITY_COIN_CORE_ADDRESS,
    contractName: CITY_COIN_CORE_CONTRACT_NAME,
    functionName: "get-user-id",
    functionArgs: [standardPrincipalCV(STXAddress)],
    network: NETWORK,
    senderAddress: GENESIS_CONTRACT_ADDRESS,
  });
  return parseInt(result.value.value);
}

export async function getCurrentCycle() {
  // Calculated from block height
  let url = '';
  let startingBlock = 0;
  let cycleLength = 0;
  
  if (NETWORK_STRING == 'mainnet') {
    url = "https://stacks-node-api.mainnet.stacks.co/extended/v1/block?limit=1"
    startingBlock = 24497
    cycleLength = 2100
  } else {
    url = "https://stacks-node-api.testnet.stacks.co/extended/v1/block?limit=1"
    startingBlock = 3521
    cycleLength = 50
  }
  const response = await fetch(url)
  const result = await response.json()
  const currentBlock = result.results[0].height
  const totalCycleBlocks = currentBlock - startingBlock
  const currentCycle = Math.floor(totalCycleBlocks / cycleLength)

  return currentCycle
}

export async function getStackingRewardForCycle(userId, targetCycle) {
  const result = await callReadOnlyFunction({
    contractAddress: CITY_COIN_CORE_ADDRESS,
    contractName: CITY_COIN_CORE_CONTRACT_NAME,
    functionName: "get-stacking-reward",
    functionArgs: [uintCV(userId), uintCV(targetCycle)],
    network: NETWORK,
    senderAddress: GENESIS_CONTRACT_ADDRESS,
  });
  console.log(result.value);
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
