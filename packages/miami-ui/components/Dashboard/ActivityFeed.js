import styles from '../../styles/ActivityFeed.module.css'
import { CITY_COIN_CORE_ADDRESS, CITY_COIN_CORE_CONTRACT_NAME } from "../../lib/constants";
import { useState, useEffect } from 'react';

const ActivityFeed = () => {
    const [activity, setActivity] = useState();
    const url = ('https://stacks-node-api.testnet.stacks.co/extended/v1/address/' +
        CITY_COIN_CORE_ADDRESS +
        '.' + CITY_COIN_CORE_CONTRACT_NAME +
        '/transactions?limit=6')

    useEffect(() => {
        getActivities().then(result => { setActivity(result); })
    }, [])

    const getActivities = async () => {
        const res = await fetch(url);
        const result = await res.json();
        console.log(`Activities: ${JSON.stringify(result)}`);
        return result;
    }
  
    return (
        <div className={styles.activity}>
            <h1>Activity feed</h1>
            <div>
                <a>Mine</a>
            </div>
            <div>
                <a>Transfer</a>
            </div>
            <div>
                <a>Stack</a>
            </div>
            <div>
                <a>Mine</a>
            </div>
            <div>
                <a>Mine</a>
            </div>
            <div>
                <a>Mine</a>
            </div>
        </div>
    )
}

export default ActivityFeed;