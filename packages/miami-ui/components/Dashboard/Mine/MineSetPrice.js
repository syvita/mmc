import styles from '../../../styles/DifferentPrice.module.css';

const DifferentPrice = () => {
  return (
    <div className={styles.mine}>
      <h2 className={styles.h2}>Mine multiple blocks</h2>
      <p>Set the price for each block (in Stacks)</p>
      {/* This div will need to be repeated for each new block dependant on user input */}
      <div className={styles.individualBlockAmount}>
        <p className={styles.blockNumber}>#2788</p>
        <input placeholder="Amount" type="number"></input>
      </div>
      <button className={styles.transactionButton}>Send Transaction</button>
      <div className={styles.progressBar}></div>
    </div>
  );
};

export default DifferentPrice;
