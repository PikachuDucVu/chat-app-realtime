import { useCallback, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { ws } from "./utils/ws";

function App() {
  const [text, setText] = useState("");
  const [roomId, setRoomId] = useState("");
  const [id, setId] = useState("");

  const handleSend = useCallback(() => {
    console.log("Sending message:", text);

    ws.send(
      JSON.stringify({
        type: "message",
        roomId,
        id,
        text,
      })
    );

    setText("");
  }, [id, roomId, text]);

  useEffect(() => {
    ws.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (data.id) {
        setId(data.id);
      }
      if (data.roomId) {
        setRoomId(data.roomId);
      }
    });

    return () => {
      ws.close();
    };
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card ">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border w-1/2 h-10"
          placeholder="Enter text"
        />

        <button onClick={handleSend}>Send</button>
        <p>room: {roomId}</p>

        <p>id: {id}</p>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
