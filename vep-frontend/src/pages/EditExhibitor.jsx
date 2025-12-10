import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../utils/axiosClient";

const EditExhibitor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventId, setEventId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    website: "",
    description: "",
    logo: null,
  });

  const fetchExhibitor = async () => {
    try {
      const res = await axiosClient.get(`/admin/exhibitors/${id}`);
      setEventId(res.data.event_id);

      setForm({
        name: res.data.name,
        website: res.data.website,
        description: res.data.description,
        logo: null,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchExhibitor();
  }, []);

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
    data.append("name", form.name);
    data.append("website", form.website);
    data.append("description", form.description);
    if (form.logo) data.append("logo", form.logo);

    try {
      await axiosClient.post(`/admin/exhibitors/${id}?_method=PUT`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate(`/admin/events/${eventId}/exhibitors`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Exhibitor</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Website:</label>
          <input name="website" value={form.website} onChange={handleChange} />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Logo:</label>
          <input type="file" name="logo" onChange={handleChange} />
        </div>

        <button type="submit" style={{ marginTop: 20 }}>
          Update Exhibitor
        </button>
      </form>
    </div>
  );
};

export default EditExhibitor;
