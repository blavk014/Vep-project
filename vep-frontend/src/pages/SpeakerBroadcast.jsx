import React from "react";
import Stream from "./Stream";

function SpeakerBroadcast({ eventId }) {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Broadcast Your Event</h1>
      <p>Use this page to stream live to attendees.</p>
      <Stream eventId={eventId} />
    </div>
  );
}

export default SpeakerBroadcast;
