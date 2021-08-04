import {
  uintCV,
  PostConditionMode,
  FungibleConditionCode,
  createAssetInfo,
  makeStandardFungiblePostCondition,
} from "@syvita/transactions";
import {
  NETWORK,
  CITY_COIN_CORE_ADDRESS,
  CITY_COIN_CORE_CONTRACT_NAME,
  CITY_COIN_TOKEN_CONTRACT_NAME,
  CC_NAME,
  NETWORK_STRING,
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
  //   getCurrentCycle().then((result) => setCurrentCycle(result));
  // }, []);

  // async function getCurrentCycle() {
  //   // Calculated from block height
  //   const url = "https://mainnet.syvita.org/extended/v1/block?limit=1";
  //   const response = await fetch(url);
  //   const result = await response.json();

  //   const cycleLength = 2100;
  //   const startingBlock = 668050;
  //   const currentBlock = result.results[0].burn_block_height;

  //   const totalCycleBlocks = currentBlock - startingBlock;
  //   const currentCycle = Math.floor(totalCycleBlocks / cycleLength) + 1;

  //   return currentCycle;
  // }

  async function stackCoins() {
    const coinAmount = 10000; // We pass this in from prev component StackHowMany @DIO

    await doContractCall({
      contractAddress: CITY_COIN_CORE_ADDRESS,
      contractName: CITY_COIN_CORE_CONTRACT_NAME,
      functionName: "stack-tokens",
      functionArgs: [uintCV(coinAmount), uintCV(cycles)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [
        makeStandardFungiblePostCondition(
          STXAddress,
          FungibleConditionCode.Equal,
          uintCV(coinAmount).value,
          createAssetInfo(
            CITY_COIN_CORE_ADDRESS,
            CITY_COIN_TOKEN_CONTRACT_NAME,
            CC_NAME
          )
        ),
      ],
      onFinish: () => {
        addStackedCycles(STXAddress, appPrivateKey, cycles);
      },
      network: NETWORK,
    });
  }

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
