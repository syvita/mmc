import { useEffect, useState } from "react";
import styles from "../../styles/Register.module.css";
import { useConnect } from '@stacks/connect-react';
import { GENESIS_CONTRACT_ADDRESS, NETWORK, CITY_COIN_CORE_ADDRESS, CITY_COIN_CORE_CONTRACT_NAME, } from "../../lib/constants";
import { getRegisteredMinerCount, registerMiner } from "../../lib/contracts";
import { someCV, noneCV } from "@stacks/transactions";

const Register = () => {
    const [minerCount, setMinerCount] = useState(null);
    const { doContractCall } = useConnect();

    useEffect(() => {
        getRegisteredMinerCount().then(result => { setMinerCount(result); });
    }, [])
    
    async function registerMiner() {
        await doContractCall({
          contractAddress: CITY_COIN_CORE_ADDRESS,
          contractName: CITY_COIN_CORE_CONTRACT_NAME,
          functionName: 'register-user',
          functionArgs: [noneCV()],
          network: NETWORK,
          senderAddress: GENESIS_CONTRACT_ADDRESS,
        });
    }
    
    function MinerButton() {
        setMinerCount(3); // REMOVE LATER, USED FOR DEV
        if (minerCount == null) {
            return <button className={styles.minersButtonLoading}>Loading...</button>
        }
        else if (minerCount >= 5) {
            return <button className={styles.minersButtonActivated}>activated</button>
        }
        else {
            return (<div className={styles.registerMiner}>
                    <button className={styles.minersButton}>{minerCount}/5 miners</button>
                <button onClick={ registerMiner } className={styles.registerToMineButton}>Register to mine</button></div>
            )
        }
    }

    return (
        <div className={styles.register}>
            <h2 className={styles.h2}>Activate MiamiCoin mining</h2>
            <p>Before mining can begin, at least 5 miners must register with the contract to signal activation.</p>
            <div className={styles.buttons}>

            <MinerButton/>
            
            </div>
        </div>
    );
};
  
export default Register;