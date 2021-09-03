import { useEffect, useState } from "react";
import styles from "../../../styles/RedeemStacking.module.css";
import { useAtom } from "jotai";
import { userSessionState } from "../../../lib/auth";
import {
  getUserId,
  getStackingRewardForCycle,
  getCurrentCycle,
  getStackerAtCycle,
} from "../../../lib/contracts";
import {
  NETWORK_STRING,
  CITY_COIN_CORE_ADDRESS,
  CITY_COIN_CORE_CONTRACT_NAME,
  NETWORK,
  CITY_COIN_TOKEN_CONTRACT_NAME,
  CITY_COIN_TOKEN_CONTRACT_ADDRESS,
  CC_NAME,
} from "../../../lib/constants";
import { useConnect } from "@syvita/connect-react";
import {
  uintCV,
  createAssetInfo,
  makeStandardSTXPostCondition,
  makeContractFungiblePostCondition,
  PostConditionMode,
  FungibleConditionCode,
  makeContractSTXPostCondition,
} from "@syvita/transactions";

const RedeemStacking = () => {
  const prevCycle = 1;
  const [cycleToRedeem, setCycleToRedeem] = useState(1);
  const [userSession] = useAtom(userSessionState);
  const [cycleNum, setCycleNum] = useState(0);
  const [totalSTX, setTotalSTX] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [percentageChecked, setPercentageChecked] = useState(0);
  const [buttons, setButtons] = useState([]);
  const userData = userSession.loadUserData();
  const { doContractCall } = useConnect();

  let STXAddress = "";
  let buttonArray = [];

  if (NETWORK_STRING == "mainnet") {
    STXAddress = userData.profile.stxAddress.mainnet;
  } else {
    STXAddress = userData.profile.stxAddress.testnet;
  }

  useEffect(() => {
    getCycleRewards();
  }, []);

  async function getCycleRewards() {
    setIsLoading(true);

    const userId = await getUserId(STXAddress);
    const currentCycle = await getCurrentCycle();

    setCycleNum(currentCycle);

    if (!(cycleToRedeem > 0)) {
      setCycleToRedeem(1);
    }
    let cyclesToCheck = [];
    let startingCycle = 1;

    while (startingCycle <= currentCycle) {
      cyclesToCheck.push(startingCycle);
      startingCycle++;
    }

    console.log(cyclesToCheck);
    const cycleRewardDict = [];
    let sum = 0;

    for (let i = 0; i < cyclesToCheck.length; i++) {
      let percent = Math.floor((i / cyclesToCheck.length) * 100);
      setPercentageChecked(percent);
      console.log(cyclesToCheck[i]);
      let repeat = true;
      let reward = 0;
      let stackerInfo = [];
      while (repeat) {
        try {
          reward = await getStackingRewardForCycle(userId, cyclesToCheck[i]);
          console.log("CYCLE: " + cyclesToCheck[i]);
          console.log("REWARD: " + reward);
          stackerInfo = await getStackerAtCycle(userId, cyclesToCheck[i]);
          repeat = false;
        } catch {
          console.log("Too many requests, retrying");
          sleep(10000);
          repeat = true;
        }
      }

      sum += reward;

      if (reward > 0 && stackerInfo[1] > 0) {
        cycleRewardDict.push({
          cycle: cyclesToCheck[i],
          amountStacked: stackerInfo[0],
          toReturn: stackerInfo[1],
          reward: reward,
        });
      } else {
        if (reward > 0) {
          cycleRewardDict.push({
            cycle: cyclesToCheck[i],
            amountStacked: stackerInfo[0],
            toReturn: stackerInfo[1],
            reward: reward,
          });
        }
      }
    }

    setTotalSTX(sum);

    console.log("CYCLE REWARDS: " + JSON.stringify(cycleRewardDict));
    setIsLoading(false);

    if (
      cycleRewardDict != [] &&
      cycleRewardDict != undefined &&
      cycleRewardDict.length != 0
    ) {
      for (let i = 0; i < cycleRewardDict.length; i++) {
        buttonArray.push(
          <button
            onClick={() =>
              claimStackingReward(
                cycleRewardDict[i].cycle,
                cycleRewardDict[i].reward,
                cycleRewardDict[i].amountStacked,
                cycleRewardDict[i].toReturn
              )
            }
            className={styles.redeemCycles}
          >
            {"CYCLE #" + cycleRewardDict[i].cycle}
          </button>
        );
      }
      setButtons(buttonArray);
    }
  }

  function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

  async function claimStackingReward(
    cycleToRedeem,
    reward,
    amountStacked,
    toReturn
  ) {
    let postConditions = [];
    if (toReturn > 0) {
      postConditions = [
        makeContractSTXPostCondition(
          CITY_COIN_CORE_ADDRESS,
          CITY_COIN_CORE_CONTRACT_NAME,
          FungibleConditionCode.Equal,
          uintCV(reward).value
        ),
        makeContractFungiblePostCondition(
          CITY_COIN_CORE_ADDRESS,
          CITY_COIN_CORE_CONTRACT_NAME,
          FungibleConditionCode.Equal,
          uintCV(amountStacked).value,
          createAssetInfo(
            CITY_COIN_TOKEN_CONTRACT_ADDRESS,
            CITY_COIN_TOKEN_CONTRACT_NAME,
            CC_NAME
          )
        ),
      ];
    } else {
      postConditions = [
        makeContractSTXPostCondition(
          CITY_COIN_CORE_ADDRESS,
          CITY_COIN_CORE_CONTRACT_NAME,
          FungibleConditionCode.Equal,
          uintCV(reward).value
        ),
      ];
    }

    await doContractCall({
      contractAddress: CITY_COIN_CORE_ADDRESS,
      contractName: CITY_COIN_CORE_CONTRACT_NAME,
      functionName: "claim-stacking-reward",
      functionArgs: [uintCV(cycleToRedeem)],
      network: NETWORK,
      postConditionMode: PostConditionMode.Deny,
      postConditions: postConditions,
    });
  }

  return (
    <div className={styles.redeemStacking}>
      <h2 className={styles.h2}>Redeem stacking rewards</h2>
      <p>
        You have a total of {" " + (totalSTX / 1000000).toLocaleString() + " "}
        redeemable STX from the below cycles. Send the transactions below to
        redeem them.
      </p>
      <p>You'll need to send a transaction for every cycle.</p>
      <p>(Current Cycle: {cycleNum})</p>
      {isLoading && (
        <div>
          Checking for cycle rewards... {percentageChecked}% (Please wait)
        </div>
      )}
      {buttons && buttons}
    </div>
  );
};

export default RedeemStacking;
