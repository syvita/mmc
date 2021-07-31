import { useEffect, useState } from "react";
import styles from "../../styles/Mine.module.css";


const Mine = () => {
    //const [minerCount, setMinerCount] = useState();
    
  



    return (
        <div className={styles.mine}>
            <h2 className={styles.h2}>Mine a single block</h2>
            <p>Enter how much you’d like to spend.</p>
            <div className={styles.transactionToSend}>
                <input placeholder="How many STX?">
            <button className={styles.transactionButton}>Send Transaction</button>
            </div>
        </div>
    );
};
  
export default Mine;