import { useEffect, useState } from "react";
import styles from "../../styles/Register.module.css";
import { getRegisteredMinerCount } from "../../lib/contracts";

const Register = () => {
    const [minerCount, setMinerCount] = useState(null);

    useEffect(() => {
        getRegisteredMinerCount().then(result => {setMinerCount(result);});
    }, [])

    return (
        <div className={styles.register}>
            <h2 className={styles.h2}>Activate MiamiCoin mining</h2>
            <p>Before mining can begin, at least 5 miners must register with the contract to signal activation.</p>
            <div className={styles.buttons}>
                <button className={styles.minersButton}>{minerCount == null ? 0 : minerCount} /5 miners</button>
            <button className={styles.registerButton}>Register to mine</button>
            </div>
        </div>
    );
};
  
export default Register;