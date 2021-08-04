import { useState } from "react";
import MineSingle from "./Mine/MineSingle";
import MineMany from "./Mine/MineMany";
import MineSetPrice from "./Mine/MineSetPrice";
import MineMiami from "./Mine/MineMiami";

const Mine = () => {
  const [state, setState] = useState("MineMiami");

  function Mine() {
    if (state == "Single") return <MineSingle />;
    else if (state == "Many") return <MineMany setState={setState} />;
    else if (state == "MineSetPrice") return <MineSetPrice />;
    else return <MineMiami setState={setState} />;
  }
  return (
    <div>
      <Mine />
    </div>
  );
};

export default Mine;
