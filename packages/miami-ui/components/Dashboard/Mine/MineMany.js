import styles from '../../../styles/MineMany.module.css';
import { useState } from 'react';
import ProgressBar from '../../ProgressBar';

const MineMany = ({ setState }) => {
  const [blocksToMine, setBlocksToMine] = useState();
  localStorage.setItem('blocksToMine', blocksToMine);

  return (
    <div className={styles.mine}>
      <h2 className={styles.h2}>Mine multiple blocks</h2>
      <p>How many blocks do you want to mine?</p>
      <button className={styles.warning}>
        Warning: using over 150 blocks may cause the transaction to fail.
      </button>
      <div className={styles.blockNumbers}>
        <input
          onChange={(event) => setBlocksToMine(event.target.value)}
          placeholder="Up to 200"
          type="number"
        />
        <button
          onClick={() => {
            setState('MineSetPrice');
          }}
          className={styles.continue}
        >
          Continue
        </button>
      </div>
      <div style={{ marginTop: '190px' }}>
        <ProgressBar progress={0.5} />
      </div>
    </div>
  );
};

export default MineMany;
