import styles from "../../../styles/DashNavBar.module.css";
import DashNavigation from "./DashNavigation";

const DashNavBar = () => {
  return (
    <div>
      <div className={styles.Title}>
        <h1>Dashboard</h1>
      </div>
      <DashNavigation />
    </div>
  );
};

export default DashNavBar;
