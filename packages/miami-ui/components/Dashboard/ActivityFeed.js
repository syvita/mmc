import styles from "../../styles/ActivityFeed.module.css";
import {
  CITY_COIN_CORE_ADDRESS,
  CITY_COIN_CORE_CONTRACT_NAME,
  API_BASE_NET_URL,
  NETWORK_STRING,
} from "../../lib/constants";
import { useState, useEffect } from "react";

const ActivityFeed = () => {
  const [transactionData, setTransactionData] = useState();

  useEffect(() => {
    const getTransactionData = async () => {
      const url =
        API_BASE_NET_URL +
        "extended/v1/address/" +
        CITY_COIN_CORE_ADDRESS +
        "." +
        CITY_COIN_CORE_CONTRACT_NAME +
        "/transactions?limit=6";
      const res = await fetch(url);
      const result = await res.json();
      return result;
    };
    getTransactionData().then((result) => setTransactionData(result.results));
  }, []);

  const activityElements = [];

  function getTokenType(contract) {
    let type = "";
    switch (contract) {
      case "stack-tokens":
      case "claim-mining-reward":
        type = "$MIA";
        break;
      default:
        type = "STX";
    }
    return type;
  }

  function getAmount(transaction) {
    let amount = 0;
    if (!transaction.post_conditions[0]) {
      amount = 0;
      if (transaction.contract_call.function_name == "claim-mining-reward") {
        amount = 250000;
      }
      return amount;
    }
    switch (transaction.contract_call.function_name) {
      case "register-user":
      case "shutdown-contract":
      case "set-city-wallet":
        amount = 0;
        break;
      case "claim-mining-reward":
        amount = 250000;
        break;
      case "claim-stacking-reward":
        amount = transaction.post_conditions[0].amount / 1000000;
        break;
      case "mine-tokens":
        amount = transaction.post_conditions[0].amount / 1000000;
        break;
      case "mine-many":
        amount = transaction.post_conditions[0].amount / 1000000;
      case "stack-tokens":
        amount = transaction.post_conditions[0].amount / 1000000;
        break;
      default:
        amount = 0;
    }
    return amount;
  }

  if (transactionData != null) {
    for (let i = 0; i < 6; i++) {
      const activity = transactionData[i];
      // console.log(
      //   "ACTIVITY :" + i + JSON.stringify(activity.contract_call.function_name)
      // );
      const transaction = {
        tx_id: activity.tx_id,
        tx_status: activity.tx_status,
        sender_address: activity.sender_address,
        contract_call: activity.contract_call.function_name,
        type: getTokenType(activity.contract_call.function_name),
        amount: getAmount(activity),
      };

      if (transaction.sender_address.length > 12)
        transaction.sender_address =
          transaction.sender_address.substring(0, 12) + "...";

      let status = "";
      switch (transaction.tx_status) {
        case "success":
          status = styles.success;
          break;
        case "pending":
          status = style.pending;
        default:
          status = styles.failed;
      }
      switch (transaction.contract_call) {
        case "mine-tokens":
        case "mine-many":
          transaction.contract_call = "Mine";
          break;
        case "claim-mining-reward":
        case "claim-stacking-reward":
          transaction.contract_call = "Redeem";
          break;
        case "register-user":
          transaction.contract_call = "Register";
          break;
        case "shutdown-contract":
          transaction.contract_call = "Shutdown";
          break;
        case "set-city-wallet":
          transaction.contract_call = "City";
          break;
        case "stack-tokens":
          transaction.contract_call = "Stack";
          break;
        default:
          transaction.contract_call = "Undefined";
      }

      const url = `https://explorer.stacks.co/txid/${transaction.tx_id}?chain=${NETWORK_STRING}`;
      activityElements.push(
        <a href={url} target="_blank" rel="noopener noreferrer">
          <div>
            <a id={status} className={styles.token}>
              {transaction.amount + " " + transaction.type}
            </a>
            <a className={styles.contract}>{transaction.contract_call}</a>
            <a className={styles.address}>{transaction.sender_address}</a>
          </div>
        </a>
      );
    }
  }

  return (
    <div className={styles.activity}>
      <h1>Activity feed</h1>
      {transactionData && activityElements}
    </div>
  );
};

export default ActivityFeed;
