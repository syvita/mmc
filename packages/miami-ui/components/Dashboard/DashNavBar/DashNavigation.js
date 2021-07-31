import NavLinks from "./DashNavLinks";
import styles from "../../../styles/DashNavBar.module.css";

const DashNavigation = () => {
  return (
    <nav className={styles.Navigation}>
      <NavLinks />
    </nav>
  );
};

export default DashNavigation;
