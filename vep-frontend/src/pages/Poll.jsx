import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import Pusher from "pusher-js";

export default function Poll({ eventId, streamId }) {
  const [polls, setPolls] = useState([]);
  const [selectedOption, setSelectedOption] = useState({});

  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: process.env.REACT_APP_PUSHER_CLUSTER,
      authEndpoint: "http://localhost:8000/api/broadcasting/auth",
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    });

    const channel = pusher.subscribe("polls");

    channel.bind("poll.voted", () => {
      axiosClient
        .get(`/events/${eventId}/polls/${streamId}`)
        .then((res) => setPolls(res.data));
    });

    return () => channel.unsubscribe();
  }, [eventId, streamId]);

  const vote = (pollId, optionId) => {
    axiosClient
      .post(`/polls/${pollId}/vote`, { option_id: optionId })
      .then((res) => {
        setPolls((prev) =>
          prev.map((p) =>
            p.id === pollId ? { ...p, voted_option_id: optionId } : p
          )
        );
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h2>Polls</h2>
      {polls.map((poll) => (
        <div key={poll.id} style={{ marginBottom: "20px" }}>
          <h3>{poll.question}</h3>
          <ul>
            {poll.options.map((opt) => (
              <li key={opt.id}>
                <button
                  disabled={poll.voted_option_id === opt.id}
                  onClick={() => vote(poll.id, opt.id)}
                >
                  {opt.option_text}{" "}
                  {poll.voted_option_id === opt.id ? "(Voted)" : ""}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
