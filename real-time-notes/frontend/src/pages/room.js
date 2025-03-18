import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000"); // Update this with your backend URL when deployed

const Room = () => {
  const { roomId } = useParams();
  const [note, setNote] = useState("");

  useEffect(() => {
    socket.emit("joinRoom", roomId);

    // Fetch existing note
    axios.get(`http://localhost:5000/api/notes/${roomId}`)
      .then((response) => {
        if (response.data.content) {
          setNote(response.data.content);
        }
      })
      .catch(() => console.log("No existing note found"));

    // Listen for real-time updates
    socket.on("updateNote", (updatedNote) => {
      setNote(updatedNote);
    });

    return () => {
      socket.off("updateNote");
    };
  }, [roomId]);

  const handleNoteChange = (e) => {
    const newText = e.target.value;
    setNote(newText);
    socket.emit("editNote", { roomId, note: newText });
  };

  // Save note to database
  const handleSave = () => {
    axios.post("http://localhost:5000/api/notes", { roomId, content: note });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Room: {roomId}</h2>
      <textarea
        value={note}
        onChange={handleNoteChange}
        rows="10"
        cols="50"
      />
      <br />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Room;
