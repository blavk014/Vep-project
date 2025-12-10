import React, { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminEventEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
  });
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    axiosClient
      .get(`/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setBanner(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", event.title);
    formData.append("description", event.description);
    formData.append("start_time", event.start_time);
    formData.append("end_time", event.end_time);
    if (banner) formData.append("banner", banner);

    try {
      await axiosClient.put(`/events/${id}`, formData);
      alert("Event updated successfully!");
      navigate("/admin/events"); // back to event list
    } catch (err) {
      console.error(err);
      alert("Error updating event");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={event.title}
          onChange={handleChange}
          placeholder="Title"
        />
        <br />
        <textarea
          name="description"
          value={event.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <br />
        <input
          type="datetime-local"
          name="start_time"
          value={event.start_time}
          onChange={handleChange}
        />
        <br />
        <input
          type="datetime-local"
          name="end_time"
          value={event.end_time}
          onChange={handleChange}
        />
        <br />
        <input type="file" onChange={handleFileChange} />
        <br />
        <button type="submit">Update Event</button>
      </form>
    </div>
  );
}
