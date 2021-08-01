import DashNavLinks from "./DashNavLinks";
import styles from "../../../styles/DashNavBar.module.css";

const DashNavigation = () => {
  return (
    <nav className={styles.Navigation}>
      <DashNavLinks />
    </nav>
  );
};

export default DashNavigation;
