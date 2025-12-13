import React from "react";
import Stream from "./Stream";

function ViewerPage({ eventId }) {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Live Event</h1>
      <p>Watch the speaker live below:</p>
      <Stream eventId={eventId} />
    </div>
  );
}

export default ViewerPage;
