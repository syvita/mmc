import { useState } from 'react';
import styles from '../styles/Dashboard.module.css';
import Register from '../components/Dashboard/Register';
import Mine from '../components/Dashboard/Mine';
import Stack from '../components/Dashboard/Stack';
import Redeem from '../components/Dashboard/Redeem'

export default function Dashboard() {
 
  const [renderedComponent, setRenderedComponent] = useState("Register");

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
 {renderedComponent === "Mine" &&  <Mine/>}
 {renderedComponent === "Stack" && <Stack/>}
 {renderedComponent === "Redeem" && <Redeem/>}
  
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
