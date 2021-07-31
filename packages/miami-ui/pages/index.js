import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { userSession, signIn, signOut } from '../components/Stacks'

export default function Home() {
  return (
    <div className={styles.main}>
      <h1 className={styles.h1}>Mine $MIA</h1>
      <p className={styles.p}>You can use this website to mine, stack, and more with your MiamiCoin.</p>
      <div className={styles.buttons}>
        <div>
        {!userSession.isUserSignedIn() && (
          <button className={styles.walletButton} onClick={signIn}>
            Connect wallet
          </button>
        )}
          {userSession.isUserSignedIn() && (
            <Link href="dashboard">
            <button className={styles.walletButton}>
              Dashboard
            </button>
            </Link>
        )}
        </div>
      
      <div><button className={styles.launchButton}>Launching August 3rd 🚀</button></div>
      </div>
    </div>
  )
}
