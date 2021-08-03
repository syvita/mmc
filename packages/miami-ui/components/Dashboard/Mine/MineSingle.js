import styles from '../../../styles/MineSingle.module.css';
import { useState } from 'react';
import {
  NETWORK,
  CITY_COIN_CORE_ADDRESS,
  CITY_COIN_CORE_CONTRACT_NAME,
  API_BASE_NET_URL,
  NETWORK_STRING
} from '../../../lib/constants';
import {
  uintCV,
  noneCV,
  makeStandardSTXPostCondition,
  PostConditionMode,
  FungibleConditionCode,
  AnchorMode,
} from '@syvita/transactions';
import { userSessionState } from '../../../lib/auth';
import { useConnect } from '@syvita/connect-react';
import { useAtom } from 'jotai';
import { addMinedBlocks } from '../../../lib/kv';

const MineSingle = () => {
  const [STXAmount, setSTXAmount] = useState();
  const [txId, setTxId] = useState();
  const { doContractCall } = useConnect();
  const [userSession] = useAtom(userSessionState);

  const userData = userSession.loadUserData();

  let STXAddress = '';

  if (NETWORK_STRING == 'mainnet') {
    STXAddress = userSession.loadUserData().profile.stxAddress.mainnet;
  } else {
    STXAddress = userSession.loadUserData().profile.stxAddress.testnet;
  }
  const appPrivateKey = userData.appPrivateKey;

  async function mineSingle() {
    let CVAmount = uintCV(Math.floor(parseFloat(STXAmount.trim()) * 1000000));
    const res = await fetch(
      API_BASE_NET_URL + 'v2/info'
    );
    const result = await res.json();
    const blockHeight = result.stacks_tip_height;

    await doContractCall({
      contractAddress: CITY_COIN_CORE_ADDRESS,
      contractName: CITY_COIN_CORE_CONTRACT_NAME,
      functionName: 'mine-tokens',
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
      onFinish: (data) => {
        console.log('ONFINISH TRIGGERED');
        const json = JSON.stringify(data, (key, value) =>
        typeof value === "bigint" ? value.toString() + "n" : value
);
        console.log(`TRANSACTION DATA: ${json}`);
        setTxId(data.txId);
        addMinedBlocks(STXAddress, appPrivateKey, blockHeight);
      },
    });
    // KV CALLS

    // TEMP SOLUTION FOR ONFINISH TRAN ID


    console.log(appPrivateKey);


  }

  return (
    <div className={styles.mine}>
      <h2 className={styles.h2}>Mine a single block</h2>
      <p>Enter how much you’d like to spend.</p>
      <div className={styles.transactionToSend}>
        <input
          onChange={(event) => setSTXAmount(event.target.value)}
          placeholder="How many STX?"
          type="number"
        ></input>
        <button onClick={mineSingle} className={styles.transactionButton}>
          Send Transaction
        </button>
      </div>
    </div>
  );
};

export default MineSingle;
