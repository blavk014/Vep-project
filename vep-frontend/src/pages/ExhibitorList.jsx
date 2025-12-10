import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../utils/axiosClient";

const ExhibitorsList = () => {
  const { eventId } = useParams();
  const [exhibitors, setExhibitors] = useState([]);

  const fetchExhibitors = async () => {
    try {
      const res = await axiosClient.get(`/admin/events/${eventId}/exhibitors`);
      setExhibitors(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchExhibitors();
  }, []);

  const deleteExhibitor = async (id) => {
    if (!window.confirm("Delete this exhibitor?")) return;

    try {
      await axiosClient.delete(`/admin/exhibitors/${id}`);
      fetchExhibitors();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Exhibitors for Event #{eventId}</h2>

      <Link to={`/admin/events/${eventId}/exhibitors/create`}>
        <button style={{ marginBottom: "20px" }}>Add Exhibitor</button>
      </Link>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Logo</th>
            <th>Website</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {exhibitors.map((ex) => (
            <tr key={ex.id}>
              <td>{ex.name}</td>
              <td>
                {ex.logo ? <img src={ex.logo} alt="" width="60" /> : "No logo"}
              </td>
              <td>{ex.website}</td>
              <td>{ex.description}</td>
              <td>
                <Link to={`/admin/exhibitors/${ex.id}/edit`}>
                  <button>Edit</button>
                </Link>

                <button
                  onClick={() => deleteExhibitor(ex.id)}
                  style={{ marginLeft: "10px", color: "red" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExhibitorsList;
