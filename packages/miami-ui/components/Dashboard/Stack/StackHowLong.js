import styles from '../../../styles/StackHowLong.module.css';

const StackHowLong = () => {
  return (
    <div className={styles.stack}>
      <h2 className={styles.h2}>Stack MiamiCoin</h2>
      <p>
        How many reward cycles do you want to stack for? Reward cycles are 2100
        blocks long (just over 2 weeks).
      </p>
      <div className={styles.howManyCycles}>
        <input placeholder="How many cycles?" type="number" />
        <button className={styles.transactionButton}>Send Transaction</button>
      </div>
    </div>
  );
};

export default StackHowLong;
