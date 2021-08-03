import { useEffect, useState } from "react";
import styles from "../../styles/Register.module.css";
import { useConnect } from '@syvita/connect-react';
import { GENESIS_CONTRACT_ADDRESS, NETWORK, CITY_COIN_CORE_ADDRESS, CITY_COIN_CORE_CONTRACT_NAME, } from "../../lib/constants";
import { getRegisteredMinerCount, getRegisteredMinersThreshold } from "../../lib/contracts";
import { someCV, noneCV } from "@syvita/transactions";

const Register = () => {
    const [minerCount, setMinerCount] = useState();
    const [minerThreshold, setMinerThreshold] = useState();
    const { doContractCall } = useConnect();

    useEffect(() => {
        getRegisteredMinersThreshold().then(result => { setMinerThreshold(result); })
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
        // setMinerCount(2); // REMOVE LATER, USED FOR DEV
        if (minerCount == null) {
            return <button className={styles.minersButtonLoading}>Loading...</button>
        }
        else if (minerCount >= 3) {
            return <button className={styles.minersButtonActivated}>activated</button>
        }
        else {
            return (<div className={styles.registerMiner}>
                                <div className={ styles.progress }>
                    <div className={styles.progressBar} style={{ width: `${(minerCount / minerThreshold) * 100}%` }}>
                <div>{minerCount + '/' + minerThreshold + ' miners'}</div>
                </div>
            </div>
                <button onClick={ registerMiner } className={styles.registerToMineButton}>Register to mine</button></div>
            )
        }
    }

    return (
        <div className={styles.register}>
            <h2 className={styles.h2}>Activate MiamiCoin mining</h2>
            <p>Before mining can begin, at least {minerThreshold} miners must register with the contract to signal activation.</p>
            <div className={styles.buttons}>

            <MinerButton/>
            
            </div>
        </div>
    );
};
  
export default Register;