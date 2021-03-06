import { useState, useEffect } from "react";
import styles from "../../../styles/DifferentPrice.module.css";
import { userSessionState } from "../../../lib/auth";
import { useConnect } from "@syvita/connect-react";
import { useAtom } from "jotai";
import { addMinedBlocks } from "../../../lib/kv";
import Transaction from "../Transaction";
import ProgressBar from "../../ProgressBar";
import { getActivationStatus } from "../../../lib/contracts";

import {
  NETWORK,
  CITY_COIN_CORE_ADDRESS,
  CITY_COIN_CORE_CONTRACT_NAME,
  NETWORK_STRING,
  API_BASE_NET_URL,
} from "../../../lib/constants";
import {
  FungibleConditionCode,
  listCV,
  makeStandardSTXPostCondition,
  PostConditionMode,
  uintCV,
} from "@syvita/transactions";

const DifferentPrice = () => {
  const blocksToMine = localStorage.getItem("blocksToMine");
  const inputs = [];
  const { doContractCall } = useConnect();
  const [userSession] = useAtom(userSessionState);
  let STXAddress = "";
  const userData = userSession.loadUserData();
  const appPrivateKey = userData.appPrivateKey;
  const [txId, setTxId] = useState();

  const [isActivated, setIsActivated] = useState(true);

  useEffect(() => {
    getActivationStatus().then((result) => setIsActivated(result));
  }, []);

  console.log("IS ACTIVATIED: " + isActivated);

  if (NETWORK_STRING == "mainnet") {
    STXAddress = userData.profile.stxAddress.mainnet;
  } else {
    STXAddress = userData.profile.stxAddress.testnet;
  }

  for (let i = 1; i <= blocksToMine; i++) {
    inputs.push(
      <div className={styles.individualBlockAmount}>
        <p className={styles.blockNumber}>#{i}</p>
        <input
          onWheel={(e) => e.target.blur()}
          placeholder="Amount"
          type="number"
        ></input>
      </div>
    );
  }

  function getValues() {
    const array = [];
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; ++i) {
      array.push(inputs[i].value);
    }

    return array;
  }

  async function mineMany() {
    const array = getValues();
    let floatArray = [];
    let sum = 0;
    let mineManyArray = [];

    for (let i = 0; i < array.length; i++) {
      floatArray.push(Math.floor(parseFloat(array[i].trim()) * 1000000));
      sum += floatArray[i];
      mineManyArray.push(uintCV(floatArray[i]));
    }
    mineManyArray = listCV(mineManyArray);

    const res = await fetch(API_BASE_NET_URL + "v2/info");
    const result = await res.json();
    const blockHeight = result.stacks_tip_height;

    await doContractCall({
      contractAddress: CITY_COIN_CORE_ADDRESS,
      contractName: CITY_COIN_CORE_CONTRACT_NAME,
      functionName: "mine-many",
      functionArgs: [mineManyArray],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [
        makeStandardSTXPostCondition(
          STXAddress,
          FungibleConditionCode.Equal,
          uintCV(sum).value
        ),
      ],
      network: NETWORK,
      onFinish: (result) => {
        setTxId(result.txId);
        // addMinedBlocks(STXAddress, appPrivateKey, minedBlocks);
      },
    });
  }

  const MineSetPrice = () => {
    return (
      <div className={styles.mine}>
        <h2 className={styles.h2}>Mine multiple blocks</h2>
        <p>Set the price for each block (in Stacks)</p>
        {/* This div will need to be repeated for each new block dependant on user input */}
        <div className={styles.blockScroll}>
          {inputs}
          <button onClick={mineMany} className={styles.transactionButton}>
            Send Transaction
          </button>
          {/* <div className={styles.progressBar}></div> */}
        </div>
        <div style={{ marginTop: "75px" }}>
          <ProgressBar progress={1} />
        </div>
      </div>
    );
  };
  return txId ? <Transaction txId={txId} /> : <MineSetPrice />;
};

export default DifferentPrice;
