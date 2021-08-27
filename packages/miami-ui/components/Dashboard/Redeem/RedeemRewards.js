import styles from '../../../styles/RedeemRewards.module.css';

const RedeemRewards = ({ setState }) => {
  return (
    <div className={styles.redeem}>
      <h2 className={styles.h2}>Redeem rewards</h2>
      <p>
        Claim your STX rewards from stacking your MiamiCoin, or claim your MIA
        rewards from mining MiamiCoin.
      </p>

      <p>
        You need to have either stacked MiamiCoin or mined MiamiCoin already to
        redeem the rewards.
      </p>

      <div className={styles.buttons}>
        <button onClick={() => setState("RedeemMining")} className={styles.redeemMining}>Mining Rewards</button>
        <button onClick={() => setState("RedeemStacking")} className={styles.redeemStacking}>Stacking Rewards</button>
      </div>
    </div>
  );
};

export default RedeemRewards;