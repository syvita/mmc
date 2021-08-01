import { callReadOnlyFunction } from "@stacks/transactions";
import { GENESIS_CONTRACT_ADDRESS, NETWORK, CITY_COIN_CORE_ADDRESS, CITY_COIN_CORE_CONTRACT_NAME, } from "./constants";

export async function getRegisteredMinerCount() {
    const result = await callReadOnlyFunction({
      contractAddress: CITY_COIN_CORE_ADDRESS,
      contractName: CITY_COIN_CORE_CONTRACT_NAME,
      functionName: 'get-registered-users-nonce',
      functionArgs: [],
      network: NETWORK,
      senderAddress: GENESIS_CONTRACT_ADDRESS,
    });
    return parseInt(result.value);
}