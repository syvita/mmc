import { useState } from 'react';
import styles from '../../../styles/RedeemStacking.module.css';
import { useAtom } from "jotai";
import { userSessionState } from "../../../lib/auth";
import fetch from "cross-fetch";
import { Configuration, AccountsApi } from "@stacks/blockchain-api-client";
import {
  NETWORK_STRING,
  CITY_COIN_CORE_ADDRESS,
  CITY_COIN_CORE_CONTRACT_NAME,
  NETWORK,
} from "../../../lib/constants";
import {
  canClaimMiningReward,
} from "../../../lib/contracts";
import { useConnect } from "@syvita/connect-react";
import { uintCV } from "@syvita/transactions";

const RedeemStacking = () => {
    const prevCycle = 1;
    const [cycleToRedeem, setCycleToRedeem] = useState(1);
    const [userSession] = useAtom(userSessionState);

    const { doContractCall } = useConnect();

    function redeemCycleRewards() {
        if (!(cycleToRedeem > 0)) {
            setCycleToRedeem(1);
        }
        claimAction(cycleToRedeem);
    }

    async function claimAction(cycleToRedeem) {
        await doContractCall({
          contractAddress: CITY_COIN_CORE_ADDRESS,
          contractName: CITY_COIN_CORE_CONTRACT_NAME,
          functionName: "claim-stacking-reward",
          functionArgs: [uintCV(cycleToRedeem)],
          network: NETWORK,
          onFinish: (result) => {
            setTxId(result.txId);
          },
        });
      }

    return (
        <div className={styles.redeemStacking}>
        <h2 className={styles.h2}>Redeem stacking rewards</h2>
        <p>
          Claim STX rewards from your stacked $MIA at the end of each cycle. Please enter a cycle number to redeem $MIA for. If you don't enter a cycle, it will check the previous cycle for rewards.
        </p>
        Cycle:
        <input
            className={styles.blockInput}
            onWheel={(e) => e.target.blur()}
            onChange={(event) => setCycleToRedeem(parseInt(event.target.value))}
            placeholder="Cycle Number"
            type="number"
            />
            <button onClick={() => redeemCycleRewards()}>Redeem</button>
      </div>
    )
}

export default RedeemStacking