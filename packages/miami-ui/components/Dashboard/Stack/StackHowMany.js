import styles from '../../../styles/StackHowMany.module.css';

const StackHowMany = () => {
  return (
    <div className={styles.stack}>
      <h2 className={styles.h2}>Stack MiamiCoin</h2>
      <p>How much MiamiCoin do you want to stack?</p>
      <div className={styles.howManyMiamiCoin}>
        <input placeholder="How many MIA?" type="number" />
        <button className={styles.continue}>Continue</button>
      </div>
    </div>
  );
};

export default StackHowMany;
