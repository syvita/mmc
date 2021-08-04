import styles from "../styles/ProgressBar.module.css";

const ProgressBar = ({ progress }) => {
  return (
    <div className={styles.progress}>
      <div
        className={styles.progressBar}
        style={{ width: `${progress * 100}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
