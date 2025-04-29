import React, { useContext, useState, useEffect } from 'react';
import WebSocketContext from '../websocket/WebSocketContext';

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
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={index}>
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title">{meter.name}</h5>
                <p className="card-text">
                  <strong>Значение:</strong> {meter.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
