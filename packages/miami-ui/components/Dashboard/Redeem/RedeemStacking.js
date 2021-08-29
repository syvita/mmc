import { useEffect, useState } from 'react';
import styles from '../../../styles/RedeemStacking.module.css';
import { useAtom } from "jotai";
import { userSessionState } from "../../../lib/auth";
import { getUserId, getStackingRewardForCycle, getCurrentCycle } from "../../../lib/contracts";
import {
  NETWORK_STRING,
  CITY_COIN_CORE_ADDRESS,
  CITY_COIN_CORE_CONTRACT_NAME,
  NETWORK,
} from "../../../lib/constants";
import { useConnect } from "@syvita/connect-react";
import { uintCV, standardPrincipalCV } from "@syvita/transactions";

const RedeemStacking = () => {
    const prevCycle = 1;
    const [cycleToRedeem, setCycleToRedeem] = useState(1);
    const [userSession] = useAtom(userSessionState);
    const [userId, setUserId] = useState(0);
    const [currentCycle, setCurrentCycle] = useState(0);
    const userData = userSession.loadUserData();
    const { doContractCall } = useConnect();


    let STXAddress = '';

    if (NETWORK_STRING == "mainnet") {
        STXAddress = userData.profile.stxAddress.mainnet;
      } else {
        STXAddress = userData.profile.stxAddress.testnet;
    }

    useEffect(() => {
        getUserId(STXAddress).then(result => setUserId(result))
        getCurrentCycle().then(result => setCurrentCycle(result))
    }, [])

    function redeemCycleRewards() {
        if (!(cycleToRedeem > 0)) {
            setCycleToRedeem(1);
        }
        claimStackingReward(cycleToRedeem);
    }

    async function claimStackingReward(cycleToRedeem) {
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
          You have 56,889 STX from cycles 8-13. Send the transactions below to redeem them.
        </p>
        <p>
          You'll need to send a transaction for every cycle.
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
            {currentCycle}
        </div>
    )
}

export default RedeemStacking