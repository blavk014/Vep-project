import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../utils/axiosClient";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    banner: "",
  });

  useEffect(() => {
    axiosClient
      .get(`/events/${id}`)
      .then((res) => {
        setForm({
          title: res.data.title,
          description: res.data.description,
          start_time: res.data.start_time,
          end_time: res.data.end_time,
          banner: res.data.banner,
        });
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("start_time", form.start_time);
      formData.append("end_time", form.end_time);

      if (form.banner instanceof File) {
        formData.append("banner", form.banner); // only append if a new file
      }

      await axiosClient.put(`/events/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Event updated successfully!");
      navigate("/admin/events");
    } catch (err) {
      console.error(err);
      alert("Error updating event.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Event</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <label>Description:</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <label>Start Time:</label>
        <input
          type="datetime-local"
          name="start_time"
          value={form.start_time}
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <label>End Time:</label>
        <input
          type="datetime-local"
          name="end_time"
          value={form.end_time}
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <label>Banner:</label>
        <input
          type="file"
          name="banner"
          onChange={(e) => setForm({ ...form, banner: e.target.files[0] })}
        />
        <br />
        <br />
        <button type="submit">Update Event</button>
        &nbsp;
        <button type="button" onClick={() => navigate("/admin/events")}>
          Cancel
        </button>
      </form>
    </div>
  );
}
