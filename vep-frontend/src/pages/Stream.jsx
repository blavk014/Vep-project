import { useEffect, useState, useRef } from "react";
import axiosClient from "../utils/axiosClient";
import Pusher from "pusher-js";
import Chat from "./Chat";

export default function Streams({ eventId }) {
  const [streams, setStreams] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [streamUrl, setStreamUrl] = useState("");

  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const peerRef = useRef(null);
  const streamRef = useRef(null);
  const [isSpeaker, setIsSpeaker] = useState(false);

  useEffect(() => {
    axiosClient
      .get(`/events/${eventId}/streams`)
      .then((res) => setStreams(res.data))
      .catch((err) => console.log(err));

    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: process.env.REACT_APP_PUSHER_CLUSTER,
      authEndpoint: "http://localhost:8000/api/broadcasting/auth",
      auth: {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    });

    const channel = pusher.subscribe(`presence-stream.${eventId}`);
    channel.bind("App\\Events\\WebRTCSignal", (signal) =>
      handleSignal(signal.data)
    );
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

  const initWebRTC = async () => {
    peerRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerRef.current.onicecandidate = (e) => {
      if (e.candidate) sendSignal("candidate", e.candidate);
    };

    peerRef.current.ontrack = (e) => {
      remoteVideo.current.srcObject = e.streams[0];
    };

    if (isSpeaker) {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideo.current.srcObject = streamRef.current;
      streamRef.current
        .getTracks()
        .forEach((track) => peerRef.current.addTrack(track, streamRef.current));
      createOffer();
    }
  };

  const createOffer = async () => {
    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);
    sendSignal("offer", offer);
  };

  const handleSignal = async (signal) => {
    if (!peerRef.current) await initWebRTC();
    const { type, data } = signal;

    if (type === "offer" && !isSpeaker) {
      await peerRef.current.setRemoteDescription(
        new RTCSessionDescription(data)
      );
      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);
      sendSignal("answer", answer);
    }

    if (type === "answer" && isSpeaker) {
      await peerRef.current.setRemoteDescription(
        new RTCSessionDescription(data)
      );
    }

    if (type === "candidate") {
      await peerRef.current.addIceCandidate(new RTCIceCandidate(data));
    }
  };

  const sendSignal = (type, data) => {
    axiosClient.post(`/stream/${eventId}/signal`, { type, data });
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

      {/* --- Live Streaming Video --- */}
      <div style={{ marginTop: "20px" }}>
        <label>
          <input
            type="checkbox"
            checked={isSpeaker}
            onChange={(e) => setIsSpeaker(e.target.checked)}
          />{" "}
          I'm the Speaker
        </label>
        <div>
          <video
            ref={localVideo}
            autoPlay
            muted
            playsInline
            style={{ width: "300px", marginRight: "10px" }}
          />
          <video
            ref={remoteVideo}
            autoPlay
            playsInline
            style={{ width: "300px" }}
          />
          {streams.map((s) => (
            <div key={s.id}>
              <h3>{s.title}</h3>
              <Chat eventId={eventId} streamId={s.id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
