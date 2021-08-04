import { useEffect, useState } from "react";
import { getMinedBlocks } from "../../lib/kv";
import styles from "../../styles/Redeem.module.css";
import { useAtom } from "jotai";
import { userSessionState } from "../../lib/auth";
import { NETWORK_STRING } from "../../lib/constants";
import { canClaimMiningReward, API_BASE_NET_URL } from "../../lib/contracts";

const Redeem = () => {
  const [userSession] = useAtom(userSessionState);

  let STXAddress = "";
  const userData = userSession.loadUserData();
  const appPrivateKey = userData.appPrivateKey;

  if (NETWORK_STRING == "mainnet") {
    STXAddress = userData.profile.stxAddress.mainnet;
  } else {
    STXAddress = userData.profile.stxAddress.testnet;
  }

  // starting block is activation block ('get-activation-block')
  //   no params
  // end block is current block

  // call 'can-claim-mining-reward' for every block (inclusive) between those two
  //   takes user (principle) and block height (uint)
  // will return true if they can or false if they can't redeem that block

  // don't have to worry bout stacking redeem yet

  const [canClaimDict, setCanClaimDict] = useState({});

  useEffect(() => {}, []);
  async function getActivationBlock() {
    const result = await callReadOnlyFunction({
      contractAddress: CITY_COIN_CORE_ADDRESS,
      contractName: CITY_COIN_CORE_CONTRACT_NAME,
      functionName: "get-activation-block",
      functionArgs: [],
      network: NETWORK,
      senderAddress: address,
    });
    console.log("Activation block : " + JSON.stringify(result.value));
    return result.value;
  }
  async function getCurrentBlockHeight() {
    let result = await fetch(API_BASE_NET_URL + "v2/info");
    let cycleData = await res.json();
    const currentBlockHeight = cycleData.stacks_tip_height;
    console.log("CURRENT BLOCK HEIGHT: " + JSON.stringify(result));
    return currentBlockHeight;
  }

  async function canClaimMiningReward(address, minerBlockHeight) {
    const result = await callReadOnlyFunction({
      contractAddress: CITY_COIN_CORE_ADDRESS,
      contractName: CITY_COIN_CORE_CONTRACT_NAME,
      functionName: "can-claim-mining-reward",
      functionArgs: [standardPrincipalCV(address), uintCV(minerBlockHeight)],
      network: NETWORK,
      senderAddress: address,
    });
    console.log("CAN CLAIM MINING REWARD: " + JSON.stringify(result));
    return result.value;
  }

  async function callClaimForEachBlock(
    activationBlock,
    currentBlock,
    STXAddress
  ) {
    const canClaimDict = [];

    return canClaimDict;
  }

  return (
    <div className={styles.redeem}>
      <h2 className={styles.h2}>Redeem rewards</h2>
      <p>
        Claim your STX rewards from stacking your MiamiCoin, or claim your MIA
        rewards from mining MiamiCoin.
      </p>
      <p>
        You need to have either stacked MiamiCoin or mined MiamiCoin already to
        redeem the rewards.
      </p>
      <div className={styles.buttons}>
        <button className={styles.noStackingRewards}>
          No stacking rewards
        </button>
        <button className={styles.noMiningRewards}>No mining rewards</button>
      </div>
    </div>
  );
};

export default Redeem;
