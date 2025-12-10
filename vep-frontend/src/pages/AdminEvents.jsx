import React, { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router-dom";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") navigate("/"); // redirect non-admin
  }, [navigate]);
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axiosClient.delete(`/events/${id}`);
      setEvents(events.filter((ev) => ev.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting event");
    }
  };

  useEffect(() => {
    axiosClient
      .get("/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin – Manage Events</h2>

      <button
        onClick={() => navigate("/admin/events/create")}
        style={{ marginBottom: 20 }}
      >
        + Create Event
      </button>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Starts</th>
            <th>Ends</th>
            <th>Actions</th> {/* 👈 NEW */}
          </tr>
        </thead>
        <tbody>
          {events.map((ev) => (
            <tr key={ev.id}>
              <td>{ev.id}</td>
              <td>{ev.title}</td>
              <td>{ev.start_time}</td>
              <td>{ev.end_time}</td>

              <td>
                <button onClick={() => navigate(`/admin/events/${ev.id}/edit`)}>
                  Edit
                </button>
                &nbsp;
                <button onClick={() => handleDelete(ev.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
