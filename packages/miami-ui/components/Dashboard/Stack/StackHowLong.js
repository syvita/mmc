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
  CITY_COIN_TOKEN_CONTRACT_ADDRESS,
} from "../../../lib/constants";
import styles from "../../../styles/StackHowLong.module.css";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userSessionState } from "../../../lib/auth";
import Transaction from "../Transaction";
// import { getCoinBalance } from "../../../lib/contracts";
import { useConnect } from "@syvita/connect-react";
import { addStackedCycles } from "../../../lib/kv";

const StackHowLong = () => {
  const [cycles, setCycles] = useState();
  const [balance, setBalance] = useState(0);
  const [currentCycle, setCurrentCycle] = useState();
  const [txId, setTxId] = useState();
  const { doContractCall } = useConnect();
  const [userSession] = useAtom(userSessionState);
  const coinAmount = uintCV(localStorage.getItem("coinAmount"));

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

  async function stackCoins() {
    // We pass this in from prev component StackHowMany @DIO

    console.log(STXAddress);
    console.log(coinAmount.value);

    console.log(uintCV(cycles).value);
    await doContractCall({
      contractAddress: CITY_COIN_CORE_ADDRESS,
      contractName: CITY_COIN_CORE_CONTRACT_NAME,
      functionName: "stack-tokens",
      functionArgs: [coinAmount, uintCV(cycles)],
      network: NETWORK,
      postConditionMode: PostConditionMode.Deny,
      postConditions: [
        makeStandardFungiblePostCondition(
          STXAddress,
          FungibleConditionCode.Equal,
          coinAmount.value,
          createAssetInfo(
            CITY_COIN_TOKEN_CONTRACT_ADDRESS,
            CITY_COIN_TOKEN_CONTRACT_NAME,
            CC_NAME
          )
        ),
      ],
      onFinish: (result) => {
        setTxId(result.txId);
        // addStackedCycles(STXAddress, appPrivateKey, stackedCycles);
      },
    });
  }

  return txId ? (
    <Transaction txId={txId} />
  ) : (
    <div className={styles.stack}>
      <h2 className={styles.h2}>Stack MiamiCoin</h2>
      <p>
        How many reward cycles do you want to stack for? Cycles are 2100 blocks
        long (just over 2 weeks).
      </p>
      <p>
        Stacking requires you lock $MIA for up to 32 consecutive cycles and 1
        cool down cycle.
      </p>
      <div className={styles.howManyCycles}>
        <input
          onWheel={(e) => e.target.blur()}
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
