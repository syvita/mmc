import { useEffect, useState } from "react";
import { getMinedBlocks } from "../../lib/kv";
import styles from "../../styles/Redeem.module.css";
import { useAtom } from "jotai";
import { userSessionState } from "../../lib/auth";
import {
  NETWORK_STRING,
  API_BASE_NET_URL,
  CITY_COIN_CORE_ADDRESS,
  CITY_COIN_CORE_CONTRACT_NAME,
  NETWORK,
} from "../../lib/constants";
import { getActivationBlock, canClaimMiningReward } from "../../lib/contracts";
import { useConnect } from "@syvita/connect-react";
import { uintCV } from "@syvita/transactions";
import Transaction from "./Transaction";

const Redeem = () => {
  const [userSession] = useAtom(userSessionState);

  let STXAddress = "";
  const userData = userSession.loadUserData();
  const appPrivateKey = userData.appPrivateKey;
  const { doContractCall } = useConnect();
  const [txId, setTxId] = useState();

  if (NETWORK_STRING == "mainnet") {
    STXAddress = userData.profile.stxAddress.mainnet;
  } else {
    STXAddress = userData.profile.stxAddress.testnet;
  }

  const [winningBlocks, setWinningBlocks] = useState();

  let buttonArray = [];
  let totalWinnings = [];

  useEffect(() => {
    getWinningBlocks(STXAddress).then((result) => setWinningBlocks(result));
  }, []);

  async function getWinningBlocks(STXAddress) {
    const res = await fetch(
      "https://api.minemiamicoin.com/blocks/wonblocks/" + STXAddress
    );
    const result = await res.json();
    if (result.success == true) {
      console.log("REQUEST SUCCEEDED");
      return result.result;
    } else {
      console.log("REQUEST FAILED");
      return [2456, 2345, 2556];
    }
  }

  if (
    winningBlocks != [] &&
    winningBlocks != undefined &&
    winningBlocks.length != 0
  ) {
    console.log("WINNING BLOCKS + " + winningBlocks);
    console.log(winningBlocks.length);
    for (let i = 0; i < winningBlocks.length; i++) {
      totalWinnings = +totalWinnings + +winningBlocks[i];
      buttonArray.push(
        <button
          onClick={() => claimAction(winningBlocks[i])}
          className={styles.redeemBlocks}
        >
          {"#" + winningBlocks[i]}
        </button>
      );
    }
  }

  async function claimAction(blockHeight) {
    await doContractCall({
      contractAddress: CITY_COIN_CORE_ADDRESS,
      contractName: CITY_COIN_CORE_CONTRACT_NAME,
      functionName: "claim-mining-reward",
      functionArgs: [uintCV(blockHeight)],
      network: NETWORK,
      onFinish: (result) => {
        setTxId(result.txId);
      },
    });
  }

  console.log(buttonArray);

  return txId ? (
    <Transaction txId={txId} />
  ) : (
    <div className={styles.redeem}>
      <h2 className={styles.h2}>Redeem mining rewards</h2>
      <p>
        You have a total {totalWinnings} $MIA from the below blocks. Send the
        transactions below to redeem them.
      </p>
      <p>You'll need to send a transaction for every block you won.</p>

      {buttonArray}
      {!buttonArray && (
        <div className={styles.buttons}>
          <button className={styles.noMiningRewards}>No mining rewards</button>
        </div>
      )}

      {buttonArray && (
        <div className={styles.buttons}>
          <button className={styles.noMiningRewards}>No mining rewards</button>
        </div>
      )}
    </div>
  );
};

export default Redeem;
