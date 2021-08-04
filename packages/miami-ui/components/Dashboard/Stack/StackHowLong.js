import {
  uintCV,
  PostConditionMode,
  FungibleConditionCode,
  createAssetInfo,
  makeStandardFungiblePostCondition,
  callReadOnlyFunction,
} from "@syvita/transactions";
import {
  NETWORK,
  CITY_COIN_CORE_ADDRESS,
  CITY_COIN_CORE_CONTRACT_NAME,
  CITY_COIN_TOKEN_CONTRACT_NAME,
  CC_NAME,
  NETWORK_STRING,
  API_BASE_NET_URL,
} from "../../../lib/constants";
import styles from "../../../styles/StackHowLong.module.css";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userSessionState } from "../../../lib/auth";
// import { getCoinBalance } from "../../../lib/contracts";
import { useConnect } from "@syvita/connect-react";
import { addStackedCycles } from "../../../lib/kv";

const StackHowLong = () => {
  const [cycles, setCycles] = useState();
  const [balance, setBalance] = useState(0);
  const [currentCycle, setCurrentCycle] = useState();
  const { doContractCall } = useConnect();
  const [userSession] = useAtom(userSessionState);

  let STXAddress = "";
  const userData = userSession.loadUserData();
  const appPrivateKey = userData.appPrivateKey;

  if (NETWORK_STRING == "mainnet") {
    STXAddress = userData.profile.stxAddress.mainnet;
  } else {
    STXAddress = userData.profile.stxAddress.testnet;
  }

  // useEffect(() => {
  //   getCoinBalance(STXAddress).then((result) => setBalance(result));
  // }, []);

  // useEffect(() => {
  //   async function getCurrentCycle() {
  //     let res = await fetch(API_BASE_NET_URL + "v2/info");
  //     let cycleData = await res.json();
  //     const blockHeight = cycleData.stacks_tip_height;

  //     const result = await callReadOnlyFunction({
  //       contractAddress: CITY_COIN_CORE_ADDRESS,
  //       contractName: CITY_COIN_CORE_CONTRACT_NAME,
  //       functionName: "get-reward-cycle",
  //       functionArgs: [uintCV(blockHeight)],
  //       network: NETWORK,
  //       senderAddress: STXAddress,
  //     });
  //     console.log(blockHeight);

  //     // const json = JSON.stringify(result, (key, value) =>
  //     //   typeof value === "bigint" ? value.toString() + "n" : value
  //     // );
  //     // console.log(json);

  //     return parseInt(result.value.value);
  //   }

  //   getCurrentCycle().then((result) => setCurrentCycle(result));
  // }, []);

  // async function stackCoins() {
  //   const coinAmount = 10000; // We pass this in from prev component StackHowMany @DIO

  //   await doContractCall({
  //     contractAddress: CITY_COIN_CORE_ADDRESS,
  //     contractName: CITY_COIN_CORE_CONTRACT_NAME,
  //     functionName: "stack-tokens",
  //     functionArgs: [uintCV(coinAmount), uintCV(cycles)],
  //     postConditionMode: PostConditionMode.Deny,
  //     postConditions: [
  //       makeStandardFungiblePostCondition(
  //         STXAddress,
  //         FungibleConditionCode.LessEqual,
  //         uintCV(coinAmount).value,
  //         createAssetInfo(
  //           CITY_COIN_CORE_ADDRESS,
  //           CITY_COIN_TOKEN_CONTRACT_NAME,
  //           CC_NAME
  //         )
  //       ),
  //     ],
  //     network: NETWORK,
  //     onFinish: () => {
  //       const stackedCycles = [];
  //       console.log("STACKED CYCLES");

  //       for (let i = 0; i < cycles; i++) {
  //         console.log("LOOP " + i);
  //         stackedCycles.push(parseInt(currentCycle) + 1 + i);
  //       }

  //       console.log("STACKED CYCLES " + stackedCycles);
  //       addStackedCycles(STXAddress, appPrivateKey, stackedCycles);
  //     },
  //   });
  // }

  return (
    <div className={styles.stack}>
      <h2 className={styles.h2}>Stack MiamiCoin</h2>
      <p>
        How many reward cycles do you want to stack for? Reward cycles are 2100
        blocks long (just over 2 weeks).
      </p>
      <div className={styles.howManyCycles}>
        <input
          onChange={(event) => setCycles(event.target.value)}
          placeholder="How many cycles?"
          type="number"
        />
        <button onClick={stackCoins} className={styles.transactionButton}>
          Send Transaction
        </button>
      </div>
    </div>
  );
};

export default StackHowLong;
