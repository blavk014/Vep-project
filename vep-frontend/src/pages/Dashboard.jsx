import { useEffect, useState } from "react";
import logout from "../utils/logout";
import axios from "../utils/axiosClient";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    axios
      .get("/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Failed to load events", err));

    axios
      .get("/my-registrations")
      .then((res) => setRegistrations(res.data.registrations))
      .catch((err) => console.error("Failed to load registrations", err));
  }, []);

  const isRegistered = (eventId) =>
    registrations.some((reg) => reg.event_id === eventId);

  const handleRegister = (eventId) => {
    axios
      .post(`/events/${eventId}/register`)
      .then(() => {
        setRegistrations((prev) => [...prev, { event_id: eventId }]);
      })
      .catch((err) => console.error("Registration failed", err));
  };

  const handleUnregister = (eventId) => {
    axios
      .delete(`/events/${eventId}/register`)
      .then(() => {
        setRegistrations((prev) => prev.filter((r) => r.event_id !== eventId));
      })
      .catch((err) => console.error("Unregister failed", err));
  };

  return (
    <div>
      <h1>Dashboard (Protected)</h1>
      <button onClick={handleLogout}>Logout</button>

      <h2>Available Events</h2>

      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id} style={{ marginBottom: "20px" }}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>

              {isRegistered(event.id) ? (
                <button onClick={() => handleUnregister(event.id)}>
                  Cancel Registration
                </button>
              ) : (
                <button onClick={() => handleRegister(event.id)}>
                  Register
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
