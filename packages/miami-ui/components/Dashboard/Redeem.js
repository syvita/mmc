import { useEffect, useState } from "react";
import { getMinedBlocks } from "../../lib/kv";
import styles from "../../styles/Redeem.module.css";
import { useAtom } from "jotai";
import { userSessionState } from "../../lib/auth";
import fetch from "cross-fetch";
import { Configuration, AccountsApi } from "@stacks/blockchain-api-client";
import {
  NETWORK_STRING,
  API_BASE_NET_URL,
  CITY_COIN_CORE_ADDRESS,
  CITY_COIN_CORE_CONTRACT_NAME,
  NETWORK,
} from "../../lib/constants";
import {
  getActivationBlock,
  canClaimMiningReward,
  getRegisteredMinerId,
} from "../../lib/contracts";
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
  const [isLoading, setIsLoading] = useState(true);

  if (NETWORK_STRING == "mainnet") {
    STXAddress = userData.profile.stxAddress.mainnet;
  } else {
    STXAddress = userData.profile.stxAddress.testnet;
  }

  const [winningBlocks, setWinningBlocks] = useState([]);

  let buttonArray = [];
  let totalWinnings = [];

  useEffect(() => {
    getClaimableBlocks().then((result) => setWinningBlocks(result));
  }, []);

  async function getClaimableBlocks() {
    let basePath = "https://stacks-node-api.mainnet.stacks.co";

    if (NETWORK_STRING != "mainnet") {
      basePath = "https://stacks-node-api.testnet.stacks.co";
    }

    const apiConfig = new Configuration({
      fetchApi: fetch,
      basePath: "https://stacks-node-api.testnet.stacks.co",
    });
    const accountsApi = new AccountsApi(apiConfig);
    console.log(STXAddress);
    console.log(accountsApi);
    const response = await accountsApi.getAccountTransactions({
      principal: STXAddress,
    });
    console.log("REPONSEEES" + response);
    const txs = response.results.filter(
      (tx) =>
        tx.tx_status === "success" &&
        tx.tx_type === "contract_call" &&
        (tx.contract_call.function_name === "mine-tokens" ||
          tx.contract_call.function_name === "mine-many") &&
        tx.contract_call.contract_id ===
          `${CITY_COIN_CORE_ADDRESS}.${CITY_COIN_CORE_CONTRACT_NAME}`
    );

    let blocksMined = [];
    console.log(txs.length);

    // ** MAGIC **
    for (let i = 0; i < txs.length; i++) {
      console.log(i);
      if (txs[i].contract_call.function_name === "mine-tokens") {
        blocksMined.push(txs[i].block_height);
      } else if (txs[i].contract_call.function_name === "mine-many") {
        blocksMined.push(txs[i].block_height);
        let blocks = txs[i].contract_call.function_args[0].repr;
        var many_amount = (blocks.match(/u/g) || []).length;
        for (let j = 1; j <= many_amount; j++) {
          console.log("MINED MANY BLOCK HEIGHT: " + txs[i].block_height + 1);
          blocksMined.push(txs[i].block_height + 1);
        }
      }
    }

    blocksMined = blocksMined.filter(Number);
    blocksMined = [...new Set(blocksMined)];

    const canClaimArray = [];
    for (let i = 0; i < blocksMined.length; i++) {
      let bool = await canClaimMiningReward(STXAddress, blocksMined[i]);
      if (bool == true) {
        canClaimArray.push(blocksMined[i]);
      }
    }
    console.log(canClaimArray);
    setIsLoading(false);
    return canClaimArray;
  }

  // async function getWinningBlocks(STXAddress) {
  //   const res =

  //   txs = getTransactionsForAddress()
  // }

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
  console.log("MINED BLOCKS" + winningBlocks);

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
      <p>
        You'll need to send a transaction for every block you won. Redeemable
        blocks will appear below.
      </p>
      {isLoading && <div>Loading... (Please wait a few seconds)</div>}
      {buttonArray && buttonArray}
    </div>
  );
};

export default Redeem;
