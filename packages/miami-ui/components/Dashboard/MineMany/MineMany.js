import styles from '../../../styles/MineMany.module.css';

const MineMany = () => {
  return (
    <div className={styles.mine}>
      <h2 className={styles.h2}>Mine multiple blocks</h2>
      <p>How many blocks do you want to mine?</p>
      <button className={styles.warning}>
        Warning: using over 150 blocks may cause the transaction to fail.
      </button>
      <div className={styles.blockNumbers}>
        <input placeholder="Up to 200" type="number" />
        <button className={styles.continue}>Continue</button>
      </div>
    </div>
  );
};

export default MineMany;
