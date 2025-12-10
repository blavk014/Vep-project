import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";

export default function Streams({ eventId }) {
  const [streams, setStreams] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [streamUrl, setStreamUrl] = useState("");

  useEffect(() => {
    axiosClient
      .get(`/events/${eventId}/streams`)
      .then((res) => setStreams(res.data))
      .catch((err) => console.log(err));
  }, [eventId]);

  const handleAdd = () => {
    axiosClient
      .post("/streams", {
        event_id: eventId,
        title,
        description,
        start_time: start,
        end_time: end,
        stream_url: streamUrl,
      })
      .then((res) => setStreams([...streams, res.data.stream]))
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this stream?")) return;

    axiosClient
      .delete(`/streams/${id}`)
      .then(() => setStreams(streams.filter((s) => s.id !== id)))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h2>Streams</h2>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="datetime-local"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      />
      <input
        type="datetime-local"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
      />
      <input
        placeholder="Stream URL"
        value={streamUrl}
        onChange={(e) => setStreamUrl(e.target.value)}
      />
      <button onClick={handleAdd}>Add Stream</button>

      <ul>
        {streams.map((s) => (
          <li key={s.id}>
            {s.title} ({s.start_time} - {s.end_time})
            <button onClick={() => handleDelete(s.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
