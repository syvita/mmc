import styles from "../styles/Layout.module.css";
import Head from "next/head";
import NavBar from "./NavBar/NavBar";

const Layout = ({ children }) => {
  return (
    <main>
      <Head>
        <title>MiamiCoin | $MIA</title>
        <meta
          name="description"
          content="The official home of Miami Coin, start mining and stacking today!"
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ee6380" />
        <meta name="apple-mobile-web-app-title" content="MiamiCoin UI" />
        <meta name="application-name" content="MiamiCoin UI" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <div className={styles.bg}>
        <NavBar />
        {children}
      </div>
    </main>
  );
};

export default Layout;
