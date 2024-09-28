import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";

const GridHistory = ({ open, setOpen }) => {
  // State to hold the history of grid updates
  const [history, setHistory] = useState({});
  // Accessing socket from context
  const { socket } = useContext(SocketContext);

  // Effect to listen for grid history updates from the socket
  useEffect(() => {
    if (socket) {
      // Listening for 'grid-history' event
      socket.on("grid-history", (data) => {
        // Merge new history data with existing history
        setHistory((prev) => ({ ...prev, ...data }));
      });
    }

    // Cleanup function to remove the event listener on unmount
    return () => {
      if (socket) {
        socket.off("grid-history");
      }
    };
  }, [socket]);

  return (
    <div
      // Close the modal when clicking outside of it
      onClick={() => setOpen(false)}
      className={`modal-container ${!open ? "hide" : "show"}`}
    >
      <div onClick={(e) => e.stopPropagation()} className="modal">
        {/* Display a message if there is no history */}
        {!history || Object.keys(history).length === 0 ? (
          <h4>No history to be found!</h4>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", rowGap: "30px" }}
          >
            {/* Map through history keys to display updates */}
            {Object.keys(history).map((key) => (
              <div key={key}>
                <h4 style={{ fontSize: "18px" }}>{key}</h4>
                <div
                  style={{
                    paddingLeft: "10px",
                    marginTop: "10px",
                    rowGap: "10px",
                  }}
                >
                  {/* Map through updates for each history entry */}
                  {history[key].updates.map((update, index) => {
                    const { row, col, unicodeCharacter } = update;

                    return (
                      <p key={index}>
                        Block [{row},{col}] updated with {unicodeCharacter}
                      </p>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GridHistory;
