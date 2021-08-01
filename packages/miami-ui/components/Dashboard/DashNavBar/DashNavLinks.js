import {useState} from 'react';



const DashNavLinks = () => {

  const [renderedComponent, setRenderedComponent] = useState();




  
// console.log(renderedComponent);

   
  return (

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

  );
};

export default DashNavLinks;