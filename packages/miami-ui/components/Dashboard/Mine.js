import styles from '../../styles/Mine.module.css';

const Mine = () => {
  return (
    <div className={styles.mine}>
      <h2 className={styles.h2}>Mine MiamiCoin</h2>
      <p>Mining MiamiCoin happens by spending STX in a given Stacks block.</p>

      <p>
        A winner is selected randomly weighted by the miners&#39; proportion of
        contributions of that block.
      </p>
      <p> Rewards can be withdrawn after a 100 block maturity window.</p>
      <div className={styles.buttons}>
        <button className={styles.singleBlockButton}>
          Mine a single block
        </button>
        <button className={styles.multipleBlockButton}>
          Mine for multiple blocks
        </button>
      </div>
    </div>
  );
};

export default Mine;
