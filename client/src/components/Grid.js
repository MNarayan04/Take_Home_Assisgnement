import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";
import Modal from "./Modal";

// Define the dimensions of the grid
const rows = 10, columns = 10;

function Grid({ hasSelected, setHasSelected }) {
  // Accessing socket from context
  const { socket } = useContext(SocketContext);
  // State to hold the current grid state
  const [gridState, setGridState] = useState({});
  // State to track the currently selected block
  const [block, setBlock] = useState({ row: "", col: "" });
  // State to control the visibility of the modal
  const [open, setOpen] = useState(false);

  // Function to handle block click
  const handleClick = (row, col) => {
    setBlock({ row, col }); // Set the block state
    setOpen(true); // Open the modal
  };

  // Effect to manage socket connections and events
  useEffect(() => {
    if (socket) {
      // Listen for initial grid state from the socket
      socket.on("initial-state", (data) => {
        setGridState(data); // Update grid state with initial data
      });

      // Listen for updates to the current grid state
      socket.on("current-state", (data) => {
        const { row, col, unicodeCharacter } = data;
        setGridState((prevGrid) => ({
          ...prevGrid,
          [`${row}-${col}`]: unicodeCharacter, // Update specific cell with new unicode character
        }));
      });
    }

    // Cleanup function to remove event listeners on unmount
    return () => {
      if (socket) {
        socket.off("initial-state");
        socket.off("current-state");
      }
    };
  }, [socket]);

  return (
    <>
      <div>
        {/* Create the grid structure */}
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={`row-${rowIndex}`} style={{ display: "flex" }}>
            {Array.from({ length: columns }, (_, colIndex) => (
              <div
                style={{
                  // Disable pointer events if a selection has been made or cell is already filled
                  pointerEvents: hasSelected || gridState[`${rowIndex}-${colIndex}`] ? "none" : "auto",
                }}
                className="cell" // Cell class for styling
                key={`col-${rowIndex}-${colIndex}`}
                onClick={() => handleClick(rowIndex, colIndex)} // Handle click to open modal
              >
                <p
                  style={{
                    fontSize: "25px", // Font size for cell content
                    color: "#83bd3f", // Text color
                    fontWeight: "600", // Font weight
                  }}
                >
                  {gridState[`${rowIndex}-${colIndex}`]} {/* Display the unicode character */}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Render the modal for selecting unicode characters */}
      <Modal {...{ block, setHasSelected, open, setOpen }} />
    </>
  );
}

export default React.memo(Grid); // Optimize component with memoization
