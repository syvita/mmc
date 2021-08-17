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
  const { doContractCall } = useConnect();
  const [isLoading, setIsLoading] = useState(false);
  const [percentageChecked, setPercentageChecked] = useState(0);
  const [startBlock, setStartBlock] = useState(0);
  const [endBlock, setEndBlock] = useState(0);

  if (NETWORK_STRING == "mainnet") {
    STXAddress = "SP26HM8T26QECGDHJM80KZFYQJTZN94BY8FJXWB7Y";
  } else {
    STXAddress = userData.profile.stxAddress.testnet;
  }

  const [winningBlocks, setWinningBlocks] = useState([]);

  let buttonArray = [];
  let totalWinnings = [];

  async function getClaimableBlocks() {
    setIsLoading(true);
    let basePath = "https://stacks-node-api.mainnet.stacks.co";

    if (NETWORK_STRING != "mainnet") {
      basePath = "https://stacks-node-api.testnet.stacks.co";
    }

    const apiConfig = new Configuration({
      fetchApi: fetch,
      basePath: basePath,
    });
    const accountsApi = new AccountsApi(apiConfig);
    const response = await accountsApi.getAccountTransactions({
      limit: 50,
      principal: STXAddress,
    });
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

    let singleBlocksMined = [];

    // ** MAGIC **
    for (let i = 0; i < txs.length; i++) {
      if (txs[i].contract_call.function_name === "mine-tokens") {
        singleBlocksMined.push(txs[i].block_height);
      } else if (txs[i].contract_call.function_name === "mine-many") {
        blocksMined.push(txs[i].block_height);
        let blocks = txs[i].contract_call.function_args[0].repr;
        var many_amount = (blocks.match(/u/g) || []).length;
        for (let j = 1; j <= many_amount; j++) {
          blocksMined.push(txs[i].block_height + j);
        }
      }
    }

    let blocksToCheck = singleBlocksMined.concat(blocksMined);

    blocksToCheck = blocksToCheck.filter(Number).sort((a, b) => a - b);
    blocksToCheck = [...new Set(blocksToCheck)];

    let blocksToCheckInRange = [];

    let oldestMinedBlock = txs[txs.length - 1].block_height;
    let recentMinedBlock = txs[0].block_height;

    blocksToCheck.forEach(function (block) {
      if (startBlock > 0 && endBlock > 0) {
        if (block >= startBlock && block <= endBlock) {
          blocksToCheckInRange.push(block);
        }
      } else {
        blocksToCheckInRange.push(block);
      }
    });

    function sleep(milliseconds) {
      const date = Date.now();
      let currentDate = null;
      do {
        currentDate = Date.now();
      } while (currentDate - date < milliseconds);
    }

    const canClaimArray = [];
    console.log("LIST OF BLOCKS TO CHECK: " + blocksToCheckInRange);

    for (let i = 0; i < blocksToCheckInRange.length; i++) {
      let percent = Math.floor((i / blocksToCheckInRange.length) * 100);
      setPercentageChecked(percent);
      console.log(blocksToCheckInRange[i]);
      let repeat = true;
      let bool = "";
      while (repeat) {
        try {
          bool = await canClaimMiningReward(
            STXAddress,
            blocksToCheckInRange[i]
          );
          console.log(bool);
          repeat = false;
        } catch {
          console.log("Too many requests, retrying");
          sleep(10000);
          repeat = true;
        }
      }

      if (bool == true) {
        canClaimArray.push(blocksToCheckInRange[i]);
      }
    }
    setIsLoading(false);
    return canClaimArray;
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

  return (
    <div className={styles.redeem}>
      <h2 className={styles.h2}>Redeem mining rewards</h2>
      <p>
        Your may redeem $MIA if you have won a block. You must wait at least 100
        blocks after you have mined in order to find out if you have won it.
      </p>
      <p>
        Click the button below to check if you have won any blocks, then send
        the transactions that appear to redeem them.
      </p>
      <p>
        Optionally, input a range to check your mined blocks. (Recommended if
        you've mined a lot of blocks!). If nothing is entered, it will check all
        the blocks you've mined since your first mining transaction.
      </p>
      Start:
      <input
        className={styles.blockInput}
        onWheel={(e) => e.target.blur()}
        onChange={(event) => setStartBlock(parseInt(event.target.value))}
        placeholder="Block Height"
        type="number"
      />
      End:
      <input
        className={styles.blockInput}
        onWheel={(e) => e.target.blur()}
        onChange={(event) => setEndBlock(parseInt(event.target.value))}
        placeholder="Block Height"
        type="number"
      />
      <button
        className={styles.checkIfWinner}
        onClick={() =>
          getClaimableBlocks().then((result) => setWinningBlocks(result))
        }
      >
        Check Blocks
      </button>
      {isLoading && (
        <div>
          Checking for claimable blocks... {percentageChecked}% (Please wait)
        </div>
      )}
      {buttonArray && buttonArray}
    </div>
  );
};

export default Redeem;
