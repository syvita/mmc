import styles from '../../../styles/SamePrice.module.css';

const SamePrice = () => {
  return (
    <div className={styles.mine}>
      <h2 className={styles.h2}>Mine multiple blocks</h2>
      <p>Do you want to spend the same price for every block?</p>
      <div className={styles.bool}>
        <button className={styles.noButton}>No</button>
        <button className={styles.yesButton}>Yes</button>
      </div>
      <div className={styles.progressBar}></div>
    </div>
  );
};

export default SamePrice;
