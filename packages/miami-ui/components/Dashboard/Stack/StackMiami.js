import styles from "../../../styles/StackMiami.module.css";

const StackMiami = ({ setState }) => {
  return (
    <div className={styles.stack}>
      <h2 className={styles.h2}>Stack MiamiCoin</h2>
      <p>
        Stacking MiamiCoin locks up the set amount in the contract for a number
        of reward cycles.
      </p>
      <p>
        Once these reward cycles pass, owners are eligible to withdraw their
        MiamiCoin in addition to STX commited by miners during that reward
        cycle, proportionate to the amount Stacked within that cycle.
      </p>
      <button
        onClick={() => {
          setState("StackHowMany");
        }}
        className={styles.continue}
      >
        Continue
      </button>
    </div>
  );
};

export default StackMiami;
