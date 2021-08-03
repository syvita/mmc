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
} from "../../../lib/constants";
import styles from "../../../styles/StackHowLong.module.css";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userSessionState } from "../../../lib/auth";
import { getCoinBalance } from "../../../lib/contracts";
import { useConnect } from "@syvita/connect-react";

const StackHowLong = () => {
  const [cycles, setCycles] = useState();
  const [balance, setBalance] = useState(0);
  const [userSession] = useAtom(userSessionState);
  const { doContractCall } = useConnect();

  let STXAddress = "";

  if (NETWORK_STRING == "mainnet") {
    STXAddress = userSession.loadUserData().profile.stxAddress.mainnet;
  } else {
    STXAddress = userSession.loadUserData().profile.stxAddress.testnet;
  }

  useEffect(() => {
    getCoinBalance(STXAddress).then((result) => setBalance(result));
  }, []);

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
