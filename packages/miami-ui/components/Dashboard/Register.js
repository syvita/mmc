import { useEffect, useState } from "react";
import styles from "../../styles/Register.module.css";
import { getRegisteredMinerCount } from "../../lib/contracts";


const Register = () => {
 

// ASS PLEASE RETURN getRegisteredMinerCount() VALUE HERE PLSSSSS
const minerCount = 0 // try to get value instead of 0 here maybe?

    return (
        <div className={styles.register}>
            <h2 className={styles.h2}>Activate MiamiCoin mining</h2>
            <p>Before mining can begin, at least 5 miners must register with the contract to signal activation.</p>
            <div className={styles.buttons}>
                {/* SO I CAN USE IT HERE!! */}
                <button className={styles.minersButton}>{minerCount}/5 miners</button>
            <button className={styles.registerButton}>Register to mine</button>
            </div>
        </div>
    );
};
  
export default Register;