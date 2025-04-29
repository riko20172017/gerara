import React, { useContext, useState, useEffect } from "react";
import WebSocketContext from "../websocket/WebSocketContext";
import Meter from "../components/Meter/meter";

export default function Meters() {
  const { send, message, readyState } = useContext(WebSocketContext);
  const [meters, setMeters] = useState([]);

  // Handle WebSocket connection state
  useEffect(() => {
    if (readyState === 1) {
      send({
        event: "get/meters/data/request",
      });
    }
  }, [readyState]);

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (message) {
      if (message.event === "get/meters/data/response") {
        setMeters([...message.data]);
      }
    }
  }, [message]);

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">IoT Счетчики</h1>
      <div className="row g-4">
        {meters.map((meter, index) => (
          <Meter
            name={meter.name}
            value={meter.value}
            index={index}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}
