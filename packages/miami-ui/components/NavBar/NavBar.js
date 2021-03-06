import styles from "../../styles/NavBar.module.css";
import Navigation from "./Navigation";
import MobileNavigation from "./MobileNavigation";
import Link from "next/link";

const NavBar = () => {
  return (
    <div>
      <div className={styles.Logo}>
        <Link href="/" passHref={true}>
          <img
            src="logo.svg"
            width="60px"
            height="20px"
            alt="CitiCoin logo SVG"
          />
        </Link>
      </div>
      <Navigation />
      <MobileNavigation />
    </div>
  );
};

export default NavBar;
