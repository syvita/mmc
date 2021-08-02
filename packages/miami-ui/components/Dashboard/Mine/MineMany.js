import styles from '../../../styles/MineMany.module.css';
import { useState } from 'react';

const MineMany = ({ setState }) => {

  const [blocksToMine, setBlocksToMine] = useState();

  return (
    <div className={styles.mine}>
      <h2 className={styles.h2}>Mine multiple blocks</h2>
      <p>How many blocks do you want to mine?</p>
      <button className={styles.warning}>
        Warning: using over 150 blocks may cause the transaction to fail.
      </button>
      <div className={styles.blockNumbers}>
        <input onChange={ event => setBlocksToMine(event.target.value) } placeholder="Up to 200" type="number" />
        <button onClick={() => { setState("MineQuestion") }} className={styles.continue}>Continue</button>
      </div>
      {blocksToMine}
    </div>
  );
};

export default MineMany;
