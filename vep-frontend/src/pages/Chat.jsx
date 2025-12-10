import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";

export default function Chat({ eventId, streamId }) {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axiosClient
      .get(`/events/${eventId}/chats/${streamId}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.log(err));
  }, [eventId, streamId]);

  const sendMsg = () => {
    axiosClient
      .post("/chats", { event_id: eventId, stream_id: streamId, message: msg })
      .then((res) => setMessages([...messages, res.data.chat]))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h2>Chat</h2>
      <ul>
        {messages.map((m) => (
          <li key={m.id}>
            {m.user.name}: {m.message}
          </li>
        ))}
      </ul>
      <input value={msg} onChange={(e) => setMsg(e.target.value)} />
      <button onClick={sendMsg}>Send</button>
    </div>
  );
}
