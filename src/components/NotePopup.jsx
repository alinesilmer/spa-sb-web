import React, { useState, useRef, useEffect } from "react";
import "../styles/note-popup.css";

const NotePopup = ({ note }) => {
  const [visible, setVisible] = useState(false);
  const popupRef = useRef();

  const togglePopup = () => setVisible(!visible);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="note-popup-wrapper" ref={popupRef}>
      <button className="notes-btn" onClick={togglePopup}>
        ➕
      </button>
      {visible && (
        <div className="note-popup">
          <p>{note}</p>
        </div>
      )}
    </div>
  );
};

export default NotePopup;
