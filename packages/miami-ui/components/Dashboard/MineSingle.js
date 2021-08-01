import styles from '../../styles/MineSingle.module.css';

const MineSingle = () => {
  return (
    <div className={styles.mine}>
      <h2 className={styles.h2}>Mine a single block</h2>
      <p>Enter how much you’d like to spend.</p>
      <div className={styles.transactionToSend}>
        <input placeholder="How many STX?" type="number" />
        <button className={styles.transactionButton}>Send Transaction</button>
      </div>
    </div>
  );
};

export default MineSingle;
