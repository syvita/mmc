import { useState } from "react";
import styles from "../styles/Dashboard.module.css";
import Register from "../components/Dashboard/Register";
import Mine from "../components/Dashboard/Mine";
import Stack from "../components/Dashboard/Stack";
import Redeem from "../components/Dashboard/Redeem";
import ActivityFeed from "../components/Dashboard/ActivityFeed";

export default function Dashboard() {
  const [renderedComponent, setRenderedComponent] = useState("Mine");

  return (
    <div className={styles.dashboard}>
      <div>
        <div className={styles.Title}>
          <h1>Dashboard</h1>
        </div>
        <nav className={styles.Navigation}>
          <div>
            {/* <a>
              <button
                style={
                  renderedComponent === "Register"
                    ? {
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        borderRadius: "10px",
                      }
                    : {}
                }
                onClick={() => {
                  setRenderedComponent("Register");
                }}
              >
                Register
              </button>
            </a> */}
            <a>
              <button
                style={
                  renderedComponent === "Mine"
                    ? {
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        borderRadius: "10px",
                      }
                    : {}
                }
                onClick={() => {
                  setRenderedComponent("Mine");
                }}
              >
                Mine
              </button>
            </a>
            <a>
              <button
                style={
                  renderedComponent === "Send"
                    ? {
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        borderRadius: "10px",
                      }
                    : {}
                }
                onClick={() => {
                  setRenderedComponent("Send");
                }}
              >
                Send
              </button>
            </a>
            <a>
              <button
                style={
                  renderedComponent === "Stack"
                    ? {
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        borderRadius: "10px",
                      }
                    : {}
                }
                onClick={() => {
                  setRenderedComponent("Stack");
                }}
              >
                Stack
              </button>
            </a>
            <a>
              <button
                style={
                  renderedComponent === "Redeem"
                    ? {
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        borderRadius: "10px",
                      }
                    : {}
                }
                onClick={() => {
                  setRenderedComponent("Redeem");
                }}
              >
                Redeem
              </button>
            </a>
          </div>
          <ActivityFeed />
        </nav>
      </div>

      {renderedComponent === "Register" && <Register />}
      {renderedComponent === "Mine" && <Mine />}
      {renderedComponent === "Stack" && <Stack />}
      {renderedComponent === "Redeem" && <Redeem />}

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
