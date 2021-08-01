import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { useConnect, userSessionState } from '../lib/auth';
import { useAtom } from 'jotai';
export default function Home() {

  const { handleOpenAuth } = useConnect();
  const [userSession] = useAtom(userSessionState);

  return (
    <div className={styles.main}>
      <h1 className={styles.h1}>Mine $MIA</h1>
      <p className={styles.p}>
        You can use this website to mine, stack, and more with your MiamiCoin.
      </p>
      <div className={styles.buttons}>
        <div>
          {!userSession.isUserSignedIn() && (
            <button className={styles.walletButton} onClick={handleOpenAuth}>
              Connect wallet
            </button>
          )}
          {userSession.isUserSignedIn() && (
            <Link href="dashboard" passHref={true}>
              <button className={styles.walletButton}>Dashboard</button>
            </Link>
          )}
        </div>

        <div>
          <button className={styles.launchButton}>
            Launching August 3rd 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
