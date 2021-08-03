import { useState } from 'react';
import styles from '../../../styles/DifferentPrice.module.css';
import { userSessionState } from '../../../lib/auth';
import { useConnect } from '@stacks/connect-react';
import { useAtom } from 'jotai';
import { NETWORK, CITY_COIN_CORE_ADDRESS, CITY_COIN_CORE_CONTRACT_NAME, NETWORK_STRING } from "../../../lib/constants";
import { FungibleConditionCode, listCV, makeStandardSTXPostCondition, PostConditionMode, uintCV, } from '@stacks/transactions';

const DifferentPrice = () => {
  const blocksToMine = localStorage.getItem('blocksToMine')
  const inputs = [];
  const { doContractCall } = useConnect();
  const [userSession] = useAtom(userSessionState);
  let STXAddress = '';

  if (NETWORK_STRING == 'mainnet') {
    STXAddress = userSession.loadUserData().profile.stxAddress.mainnet;
  } else {
    STXAddress = userSession.loadUserData().profile.stxAddress.testnet;
  }
 


  for (let i = 1; i <= blocksToMine; i++) {
    inputs.push(
      <div className={styles.individualBlockAmount}>
        <p className={styles.blockNumber}>#{i}</p>
        <input placeholder="Amount" type="number"></input>
      </div>
    )
  }

  function getValues() {
    const array = [];
    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; ++i) {
      array.push(inputs[i].value)
    }

    return array;
  }


  async function mineMany() {
    const array = getValues();
    let floatArray = [];
    let sum = 0;
    let mineManyArray = [];

    for (let i = 0; i < array.length; i++){
      floatArray.push(Math.floor(parseFloat(array[i].trim()) * 1000000));
      sum += floatArray[i];
      mineManyArray.push(uintCV(floatArray[i]));
    }
    mineManyArray = listCV(mineManyArray);
    
    await doContractCall({
      contractAddress: CITY_COIN_CORE_ADDRESS,
      contractName: CITY_COIN_CORE_CONTRACT_NAME,
      functionName: 'mine-many',
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
    });
  }
  
  return (
    <div className={styles.mine}>
      <h2 className={styles.h2}>Mine multiple blocks</h2>
      <p>Set the price for each block (in Stacks)</p>
      {/* This div will need to be repeated for each new block dependant on user input */}
      <div className={styles.blockScroll}>
      { inputs }
        <button onClick={mineMany} className={styles.transactionButton}>Send Transaction</button>
      {/* <div className={styles.progressBar}></div> */}
      </div>
    </div>
  );
};

export default DifferentPrice;
