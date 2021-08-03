import { useState } from "react";
import styles from "../../../styles/StackHowMany.module.css";

const StackHowMany = ({ setState }) => {
  const [stackAmount, setStackAmount] = useState();

  async function stackCoins() {
    return 1;
  }

  return (
    <div className={styles.stack}>
      <h2 className={styles.h2}>Stack MiamiCoin</h2>
      <p>How much MiamiCoin do you want to stack?</p>
      <div className={styles.howManyMiamiCoin}>
        <input
          onChange={(event) => setStackAmount(event.target.value)}
          placeholder="How much MIA?"
          type="number"
        />
        <button
          onClick={() => {
            stackCoins();
            setState("StackHowLong");
          }}
          className={styles.continue}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default StackHowMany;
