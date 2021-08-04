import styles from "../styles/About.module.css";

const About = () => {
  return (
    <div className={styles.about}>
      <h1>minemiamicoin.com</h1>
      <p>
        Welcome! This is the official UI for the MiamiCoin project by CityCoins.
      </p>

      <p>
        This web app allows users to register for mining, mine, send, stack, and
        redeem rewards.
      </p>

      <h2>Who built this?</h2>
      <p>
        This web app was built from scratch by the Syvita Guild. Invidia &
        Diopitis coded the UI and Asteria designed it. We’re honoured to be part
        of the CityCoins community and to have helped pitched in!
      </p>

      <p>This site is managed under Syvita’s shared infrastructure.</p>
    </div>
  );
};

export default About;
