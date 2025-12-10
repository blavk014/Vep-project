import React, { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { useParams } from "react-router-dom";

function ExhibitorBooth() {
  const { exhibitorId } = useParams();
  const [booth, setBooth] = useState(null);

  useEffect(() => {
    axiosClient
      .get(`/admin/exhibitors/${exhibitorId}/booths`)
      .then((res) => setBooth(res.data));
  }, [exhibitorId]);

  if (!booth) return <p>No booth created yet.</p>;

  return (
    <div>
      <h2>{booth.title}</h2>

      {booth.video_url && (
        <iframe
          width="560"
          height="315"
          src={booth.video_url}
          title="Booth Video"
        ></iframe>
      )}

      <p>{booth.info}</p>

      {booth.brochure && (
        <a href={booth.brochure} target="_blank" rel="noreferrer">
          Download Brochure
        </a>
      )}
    </div>
  );
}

export default ExhibitorBooth;
