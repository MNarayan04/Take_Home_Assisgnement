import { useContext, useEffect, useState } from "react";
import Grid from "./components/Grid";
import { SocketContext } from "./context/SocketContext";
import { PiUsersThreeFill } from "react-icons/pi";
import { IoTimeOutline } from "react-icons/io5";
import { MdManageHistory } from "react-icons/md";
import GridHistory from "./components/GridHistory";

function App() {
  // State for countdown timer
  const [count, setCount] = useState(60);
  // Accessing socket from context
  const { socket } = useContext(SocketContext);
  // State to hold the list of current online users
  const [currentOnline, setCurrentOnline] = useState([]);
  // State to track if a selection has been made
  const [hasSelected, setHasSelected] = useState(false);
  // State to control the visibility of the history grid
  const [open, setOpen] = useState(false);

  // Effect to listen for online users from the socket
  useEffect(() => {
    if (socket) {
      socket.on("online-users", (data) => {
        setCurrentOnline(data); // Update online users state
      });
    }
  }, [socket]);

  // Function to format the countdown timer
  const formatTime = (seconds) => {
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `0:${formattedSeconds}`; // Return formatted time string
  };

  // Effect to handle countdown timer when a selection is made
  useEffect(() => {
    if (hasSelected) {
      setCount(60); // Reset timer to 60 seconds
      const timer = setInterval(() => {
        setCount((prev) => {
          if (prev === 0) {
            setHasSelected(false); // Reset selection when time is up
            return prev;
          }
          return prev - 1; // Decrement timer
        });
      }, 1000); // Update every second

      return () => clearInterval(timer); // Cleanup timer on unmount
    }
  }, [hasSelected]);

  return (
    <>
      <div className="main">
        <div>
          <div className="main-header">
            <div
              style={{
                display: "flex",
                flex: 1,
                alignItems: "center",
                columnGap: 10,
              }}
            >
              {/* Online users icon and count */}
              <PiUsersThreeFill size={25} color="green" />
              <h3>{currentOnline.length}</h3>
            </div>
            {/* Show timer if a selection has been made */}
            {hasSelected && (
              <div
                style={{ display: "flex", alignItems: "center", columnGap: 5 }}
              >
                <IoTimeOutline size={20} color="red" />
                <p style={{ color: "red", fontWeight: "600" }}>
                  {formatTime(count)} {/* Display formatted countdown */}
                </p>
              </div>
            )}
            {/* Button to open history grid */}
            <button
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => setOpen(true)}
            >
              <MdManageHistory size={20} />
            </button>
          </div>
          {/* Main grid component */}
          <Grid {...{ hasSelected, setHasSelected }} />
        </div>
      </div>

      {/* History grid that can be opened */}
      <GridHistory {...{ open, setOpen }} />
    </>
  );
}

export default App;
