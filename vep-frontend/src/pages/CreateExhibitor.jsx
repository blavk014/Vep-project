import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../utils/axiosClient";

const CreateExhibitor = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    website: "",
    description: "",
    logo: null,
  });

  const handleChange = (e) => {
    if (e.target.name === "logo") {
      setForm({ ...form, logo: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let data = new FormData();
    data.append("event_id", eventId);
    data.append("name", form.name);
    data.append("website", form.website);
    data.append("description", form.description);
    if (form.logo) data.append("logo", form.logo);

    try {
      await axiosClient.post("/admin/exhibitors", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate(`/admin/events/${eventId}/exhibitors`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Exhibitor</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Name:</label>
          <input name="name" onChange={handleChange} required />
        </div>

        <div>
          <label>Website:</label>
          <input name="website" onChange={handleChange} />
        </div>

        <div>
          <label>Description:</label>
          <textarea name="description" onChange={handleChange} />
        </div>

        <div>
          <label>Logo:</label>
          <input type="file" name="logo" onChange={handleChange} />
        </div>

        <button type="submit" style={{ marginTop: "15px" }}>
          Save Exhibitor
        </button>
      </form>
    </div>
  );
};

export default CreateExhibitor;
