import React, { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { useParams } from "react-router-dom";

function BoothEditor() {
  const { exhibitorId } = useParams();
  const [loading, setLoading] = useState(true);
  const [booth, setBooth] = useState(null);

  const [form, setForm] = useState({
    title: "",
    video_url: "",
    info: "",
    brochure: null,
  });

  useEffect(() => {
    axiosClient
      .get(`/admin/exhibitors/${exhibitorId}/booths`)
      .then((res) => {
        if (res.data) {
          setBooth(res.data);
          setForm({
            title: res.data.title,
            video_url: res.data.video_url,
            info: res.data.info,
            brochure: null,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [exhibitorId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) payload.append(key, form[key]);
    });

    payload.append("exhibitor_id", exhibitorId);

    const request = booth
      ? axiosClient.post(`/admin/booths/${booth.id}?_method=PUT`, payload)
      : axiosClient.post("/admin/booths", payload);

    request.then(() => {
      alert("Booth saved successfully");
      window.location.reload();
    });
  };

  if (loading) return <p>Loading booth...</p>;

  return (
    <div>
      <h2>{booth ? "Edit Booth" : "Create Booth"}</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="title"
          placeholder="Booth Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="video_url"
          placeholder="Video URL"
          value={form.video_url}
          onChange={handleChange}
        />

        <textarea
          name="info"
          placeholder="Booth Information"
          value={form.info}
          onChange={handleChange}
        />

        <input type="file" name="brochure" onChange={handleChange} />

        <button type="submit">{booth ? "Update Booth" : "Create Booth"}</button>
      </form>
    </div>
  );
}

export default BoothEditor;
