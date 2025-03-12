import { useCallback, useEffect, useState } from "react";
import { ws } from "./utils/ws";
import { Route, Switch } from "wouter";
import HomeScreen from "./screens/HomeScreen";

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
    <Switch>
      <Route path="/" component={HomeScreen} />
    </Switch>
  );
}

export default App;
