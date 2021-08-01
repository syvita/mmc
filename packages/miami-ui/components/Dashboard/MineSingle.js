import styles from '../../styles/MineSingle.module.css';
import { useState } from 'react';
import { NETWORK, CITY_COIN_CORE_ADDRESS, CITY_COIN_CORE_CONTRACT_NAME } from "../../lib/constants";
import { useConnect } from '@stacks/connect-react';
import { uintCV, noneCV, makeStandardSTXPostCondition, PostConditionMode, FungibleConditionCode, AnchorMode, } from '@stacks/transactions';
import { useStxAddresses } from '../../lib/hooks';
import { userSessionState } from '../../lib/auth'
import { useAtom } from 'jotai';

const MineSingle = () => {
  const [STXAmount, setSTXAmount] = useState();
  const { doContractCall } = useConnect();
  const [userSession] = useAtom(userSessionState);
  const stxAddress = useStxAddresses(userSession).ownerStxAddress
  console.log(stxAddress)

  async function mineSingle() {
    let CVAmount = uintCV(Math.floor(parseFloat(STXAmount.trim()) * 1000000));
    console.log(CVAmount);
    await doContractCall({
      contractAddress: CITY_COIN_CORE_ADDRESS,
      contractName: CITY_COIN_CORE_CONTRACT_NAME,
      functionName: 'mine-tokens',
      functionArgs: [CVAmount, noneCV()],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [
        makeStandardSTXPostCondition(
          stxAddress,
          FungibleConditionCode.Equal,
          CVAmount.value
        ),
      ],
      anchorMode: AnchorMode.OnChainOnly,
      network: NETWORK,
    });
  }

  return (
    <div className={styles.mine}>
      <h2 className={styles.h2}>Mine a single block</h2>
      <p>Enter how much you’d like to spend.</p>
      <div className={styles.transactionToSend}>
        <input onChange={ event => setSTXAmount(event.target.value) } placeholder="How many STX?" type="number" />
        <button onClick={ mineSingle } className={styles.transactionButton}>Send Transaction</button>
      </div>
      {STXAmount}
    </div>
  );
};

export default MineSingle;
