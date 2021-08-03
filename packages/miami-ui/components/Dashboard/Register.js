import { useEffect, useState } from "react";
import styles from "../../styles/Register.module.css";
import { useConnect } from '@stacks/connect-react';
import { GENESIS_CONTRACT_ADDRESS, NETWORK, CITY_COIN_CORE_ADDRESS, CITY_COIN_CORE_CONTRACT_NAME, } from "../../lib/constants";
import { getRegisteredMinerCount, getRegisteredMinersThreshold } from "../../lib/contracts";
import { someCV, noneCV } from "@stacks/transactions";
import { NETWORK_STRING, API_BASE_NET_URL } from "../../lib/constants"
import Router from "next/router";

const Register = () => {
    const [minerCount, setMinerCount] = useState();
    const [minerThreshold, setMinerThreshold] = useState();
    const { doContractCall } = useConnect();
    const hasRegistered = typeof window !== 'undefined' ? localStorage.getItem('hasRegistered') : null


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
          onFinish: result => {
              localStorage.setItem("hasRegistered", result.txId);
              Router.reload(window.location.pathname);
            },
          
        })
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

    const RegisterPage = () => {
        return (
      
        <div className={styles.register}> 
            <h2 className={styles.h2}>Activate MiamiCoin mining</h2>
            <p>Before mining can begin, at least {minerThreshold} miners must register with the contract to signal activation.</p>
            
            <div className={styles.buttons}>
            </div>
             <MinerButton/>
            </div>
           
      
        )
    }

    const TransactionStatus = () => {
        
        const [status, setStatus] = useState();
        useEffect(() => {
            getStatus().then(result => { setStatus(result); });
        }, [])

        
        async function getStatus() {
            const url = API_BASE_NET_URL + 'extended/v1/tx/' + hasRegistered;
            console.log(url)
            const res = await fetch(url);
            const result = await res.json();
            return result.tx_status;
        }

        let title = ''
        let image = ''
        switch (status) {
            case 'success':
                title = 'Transaction confirmed!'
                image = '/tx-status/success.svg'
                break;
            case 'pending':
                title = 'Transaction pending...'
                image = '/tx-status/pending.svg'
            default:
                title = 'Transaction failed!'
                image = '/tx-status/failure.svg'
        }

        const explorer_url = `https://explorer.stacks.co/txid/${hasRegistered}?chain=${NETWORK_STRING}`
        return (
        <div className={styles.transaction}>
                <img src={image} height="66px" width="66px" alt="Cycles" />
                <h2>{title}</h2>
                <p>This page will autoupdate with the status. <a href={explorer_url} target="_blank" rel="noopener noreferrer">View on Stacks Explorer.</a></p>
        </div>
        )
    }
     
    return (
         !hasRegistered ? <RegisterPage /> : <TransactionStatus />
    );
};
  
export default Register;