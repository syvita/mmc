import { useEffect, useState } from "react";
import { getMinedBlocks } from "../../lib/kv";
import styles from "../../styles/Redeem.module.css";
import { useAtom } from "jotai";
import { userSessionState } from "../../lib/auth";
import { NETWORK_STRING } from "../../lib/constants";
import { canClaimMiningReward } from "../../lib/contracts";

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
