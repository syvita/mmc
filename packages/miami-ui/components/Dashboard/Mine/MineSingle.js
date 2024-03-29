import styles from "../../../styles/MineSingle.module.css";
import { useState, useEffect } from "react";
import Transaction from "../Transaction";
import { getActivationStatus } from "../../../lib/contracts";

import {
  NETWORK,
  CITY_COIN_CORE_ADDRESS,
  CITY_COIN_CORE_CONTRACT_NAME,
  API_BASE_NET_URL,
  NETWORK_STRING,
} from "../../../lib/constants";

import {
  uintCV,
  noneCV,
  makeStandardSTXPostCondition,
  PostConditionMode,
  FungibleConditionCode,
  AnchorMode,
} from "@syvita/transactions";
import { userSessionState } from "../../../lib/auth";
import { useConnect } from "@syvita/connect-react";
import { useAtom } from "jotai";
import { addMinedBlocks } from "../../../lib/kv";

const MineSingle = () => {
  const [STXAmount, setSTXAmount] = useState();
  const { doContractCall } = useConnect();
  const [userSession] = useAtom(userSessionState);
  const [txId, setTxId] = useState();
  const userData = userSession.loadUserData();

  const [isActivated, setIsActivated] = useState(true);

  useEffect(() => {
    getActivationStatus().then((result) => setIsActivated(result));
  }, []);

  console.log("IS ACTIVATIED: " + isActivated);

  let STXAddress = "";

  console.log(userData);

  if (NETWORK_STRING == "mainnet") {
    STXAddress = userData.profile.stxAddress.mainnet;
  } else {
    STXAddress = userData.profile.stxAddress.testnet;
  }
  const appPrivateKey = userData.appPrivateKey;

  async function mineSingle() {
    let CVAmount = uintCV(Math.floor(parseFloat(STXAmount.trim()) * 1000000));
    const res = await fetch(API_BASE_NET_URL + "v2/info");
    const result = await res.json();
    const blockHeight = result.stacks_tip_height;

    await doContractCall({
      contractAddress: CITY_COIN_CORE_ADDRESS,
      contractName: CITY_COIN_CORE_CONTRACT_NAME,
      functionName: "mine-tokens",
      functionArgs: [CVAmount, noneCV()],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [
        makeStandardSTXPostCondition(
          STXAddress,
          FungibleConditionCode.Equal,
          CVAmount.value
        ),
      ],
      network: NETWORK,
      onFinish: (result) => {
        setTxId(result.txId);
        //addMinedBlocks(STXAddress, appPrivateKey, blockHeight);
      },
    });
    // KV CALLS

    // TEMP SOLUTION FOR ONFINISH TRAN ID
  }

  return txId ? (
    <Transaction txId={txId} />
  ) : (
    <div className={styles.mine}>
      <h2 className={styles.h2}>Mine a single block</h2>
      <p>Enter how much you’d like to spend.</p>
      <div className={styles.transactionToSend}>
        <input
          onWheel={(e) => e.target.blur()}
          onChange={(event) => setSTXAmount(event.target.value)}
          placeholder="How many STX?"
          type="number"
        />
        <button onClick={mineSingle} className={styles.transactionButton}>
          Send Transaction
        </button>
      </div>
    </div>
  );
};

export default MineSingle;
