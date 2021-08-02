import StackMiami from "./Stack/StackMiami";
import StackHowMany from "./Stack/StackHowMany";
import StackHowLong from "./Stack/StackHowLong";
import { useState } from "react";


const Stack = () => {

const [state, setState] = useState('StackMiami');

  
  function Stack() {
    if (state == 'StackHowLong') return <StackHowLong/>
    else if (state == 'StackHowMany') return <StackHowMany setState={ setState }/>
    else return <StackMiami setState={ setState }/>
  }
  return <div><Stack/></div>;
};

export default Stack;