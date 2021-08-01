import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Dashboard.module.css';
import { userSession, signIn, signOut } from '../components/Stacks';
import DashNavBar from '../components/Dashboard/DashNavBar/DashNavBar';
import Register from '../components/Dashboard/Register';
import Mine from '../components/Dashboard/Mine';
import MineSingle from '../components/Dashboard/MineSingle';
import MineMany from '../components/Dashboard/MineMany/MineMany';
import SamePrice from '../components/Dashboard/MineMany/SamePrice';
import DifferentPrice from '../components/Dashboard/MineMany/DifferentPrice';
import Stack from '../components/Dashboard/Stack/Stack';
import StackHowMany from '../components/Dashboard/Stack/StackHowMany';
import StackHowLong from '../components/Dashboard/Stack/StackHowLong';

export default function Dashboard() {
  const [component, setComponent] = useState('Register');

  return (
    <div className={styles.dashboard}>
      <DashNavBar />
      {/* {component === "Register" && } */}
      <Register />
      {/* <Mine /> */}
      {/* <MineSingle /> */}
      {/* <MineMany /> */}
      {/* <SamePrice /> */}
      {/* <DifferentPrice /> */}
      {/* <Stack /> */}
      {/* <StackHowMany /> */}
      {/* <StackHowLong /> */}
    </div>
  );
}
