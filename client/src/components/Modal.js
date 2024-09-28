import React, { useContext, useRef } from "react";
import { SocketContext } from "../context/SocketContext";

export default function Modal({ block, setHasSelected, open, setOpen }) {
  // Reference to the input element
  const inputRef = useRef(null);
  // Accessing socket from context
  const { socket } = useContext(SocketContext);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const unicodeCharacter = inputRef.current.value; // Get the input value
    if (!unicodeCharacter) return; // Exit if input is empty

    // Emit the selected cell data through the socket
    socket.emit("cell-selected", {
      row: block.row, // Row of the selected cell
      col: block.col, // Column of the selected cell
      unicodeCharacter: inputRef.current.value, // The unicode character input
    });

    // Close the modal and indicate that a selection has been made
    setOpen(false);
    setHasSelected(true);
  };

  return (
    <div
      // Close the modal when clicking outside of it
      onClick={() => setOpen(false)}
      className={`modal-container ${!open ? "hide" : "show"}`}
    >
      <div onClick={(e) => e.stopPropagation()} className="modal">
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef} // Attach reference to the input element
            className="form-input"
            type="text"
            placeholder="Enter unicode character" // Placeholder for input
          />
          <button type="submit" className="submit-btn">
            Submit {/* Button to submit the form */}
          </button>
        </form>
      </div>
    </div>
  );
}
