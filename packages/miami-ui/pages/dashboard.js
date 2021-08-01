import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from "next/link";
import styles from '../styles/Dashboard.module.css';
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
 
    const [renderedComponent, setRenderedComponent] = useState("Register");

    console.log(renderedComponent);

  return (
        <div className={styles.dashboard}>



   <div>
      <div className={styles.Title}>
        <h1>Dashboard</h1>
      </div>
      <nav className={styles.Navigation}>
       <div>
        <a>
        <button onClick={
          () => { setRenderedComponent("Register") }}>Register</button>
        </a>
        <a>
        <button onClick={
          () => { setRenderedComponent("Mine") }}>Mine</button>
        </a>
        <a>
        <button onClick={
          () => { setRenderedComponent("Send") }}>Send</button>
        </a>
        <a>
        <button onClick={
          () => { setRenderedComponent("Stack") }}>Stack</button>
        </a>
        <a>
        <button onClick={
          () => { setRenderedComponent("Redeem") }}>Redeem</button>
        </a>
    </div>
    </nav>
    </div>
  
  

 {renderedComponent === "Register" && <Register/>}
 {renderedComponent === "Mine" && <Mine/>}
  {renderedComponent === "Stack" && <Stack/>}
  
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
