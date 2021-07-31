import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Dashboard.module.css'
import { userSession, signIn, signOut } from '../components/Stacks';
import DashNavBar from '../components/Dashboard/DashNavBar/DashNavBar';
import Register from '../components/Dashboard/Register';

export default function Dashboard() {
  return (
      <div className={styles.dashboard}>
          <DashNavBar />
          <Register />

    </div>
  )
}
