import React, { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

export default function Meters() {
  const WS_URL = `ws://${process.env.REACT_APP_API_IP}:7000`;
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL, { share: false, shouldReconnect: () => true });

  const [meters, setMeters] = useState([]);

  // Handle WebSocket connection state
  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        event: "get/meters/data/request",
      });
    }
  }, [readyState]);

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (lastJsonMessage) {
      if (lastJsonMessage.event === "get/meters/data/response") {
        setMeters([...lastJsonMessage.data]);
      }
    }
  }, [lastJsonMessage]);

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
