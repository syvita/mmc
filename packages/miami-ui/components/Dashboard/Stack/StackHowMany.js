import { getCityCoinBalance } from '../../../lib/contracts';
import styles from '../../../styles/StackHowMany.module.css';
import { useStxAddresses } from '../../../lib/hooks';
import { userSessionState } from '../../../lib/auth'
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

const StackHowMany = () => {
  const [userSession] = useAtom(userSessionState);
  const stxAddress = useStxAddresses(userSession).ownerStxAddress
  const [balance, setBalance] = useState()
  
  
 

  // useEffect(() => {
  //   getCityCoinBalance(stxAddress).then(result => { setBalance(result); console.log(result) });
  // }, [])


  // console.log((balance))


  return (
    <div className={styles.stack}>
      <h2 className={styles.h2}>Stack MiamiCoin</h2>
      <p>How much MiamiCoin do you want to stack?</p>
      <div className={styles.howManyMiamiCoin}>
        <input placeholder="How many MIA?" type="number" />
        <button className={styles.continue}>Continue</button>
      </div>
      {balance == null ? 0 : balance}
    </div>
  );
};

export default StackHowMany;
