import { useState } from "react";
import RedeemRewards from "./Redeem/RedeemRewards";
import RedeemMining from "./Redeem/RedeemMining";
import RedeemStacking from "./Redeem/RedeemStacking";

const Redeem = () => {
  const [state, setState] = useState("RedeemRewards");

  function Redeem() {
    if (state == "RedeemMining") return <RedeemMining />;
    else if (state == "RedeemStacking") return <RedeemStacking />;
    else return <RedeemRewards setState={setState} />;
  }
  return (
    <div>
      <Redeem />
    </div>
  );
};

export default Redeem;
