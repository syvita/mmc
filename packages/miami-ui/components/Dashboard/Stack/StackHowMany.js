import { useState } from "react";
import styles from "../../../styles/StackHowMany.module.css";

const StackHowMany = ({ setState }) => {
  const [coinAmount, setCoinAmount] = useState();
  localStorage.setItem("coinAmount", coinAmount);

  return (
    <div className={styles.stack}>
      <h2 className={styles.h2}>Stack MiamiCoin</h2>
      <p>How much MiamiCoin do you want to stack?</p>
      <div className={styles.howManyMiamiCoin}>
        <input
          onWheel={(e) => e.target.blur()}
          onChange={(event) => setCoinAmount(event.target.value)}
          placeholder="How much MIA?"
          type="number"
        />
        <button
          onClick={() => {
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
