import { useState } from "react";
import styles from "../../../styles/MineMiami.module.css";

const MineMiami = ({ setState }) => {
  const [agree, setAgree] = useState(false);

  const checkboxHandler = () => {
    // if agree === true, it will be set to false
    // if agree === false, it will be set to true
    setAgree(!agree);
    // Don't miss the exclamation mark
  };
  return (
    <div className={styles.mine}>
      <h2 className={styles.h2}>Mine MiamiCoin</h2>
      <p>Mining MiamiCoin happens by spending STX in a given Stacks block.</p>

      <p>
        A winner is selected randomly weighted by the miners&#39; proportion of
        contributions of that block.
      </p>
      <p> Rewards can be withdrawn after a 100 block maturity window.</p>
      <input type="checkbox" name="agree" onChange={checkboxHandler}></input>
      <label htmlFor="agree" className={styles.agree}>
        I confirm that by participating in mining, I understand:
        <li>
          - The City of Miami has not yet officially claimed the MiamiCoin
          protocol contribution.
        </li>
        <li>
          - Participation does not guarantee winning the rights to claim newly
          minted $MIA
        </li>
        <li>- Once STX are sent to the contract, they are not returned</li>
      </label>
      <div className={styles.buttons}>
        <button
          className={styles.singleBlockButton}
          disabled={!agree}
          style={!agree ? { cursor: "not-allowed" } : {}}
          onClick={() => {
            setState("Single");
          }}
        >
          Mine a single block
        </button>
        <button
          className={styles.multipleBlockButton}
          disabled={!agree}
          style={!agree ? { cursor: "not-allowed" } : {}}
          onClick={() => {
            setState("Many");
          }}
        >
          Mine for multiple blocks
        </button>
      </div>
    </div>
  );
};

export default MineMiami;
