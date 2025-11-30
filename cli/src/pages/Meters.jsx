import React, { useContext, useState, useEffect } from "react";
import WebSocketContext from "../websocket/WebSocketContext";
import Meter from "../components/Meter/meter";
import Back from "../components/gui/Back/Back";
import { Link } from "react-router-dom";

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

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (readyState === 1) {
        send({
          event: "get/meters/data/request",
        });
      }
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="py-4">
      <div className="row">
        <div className="col-12 col-sm-1">
          <Back></Back>
        </div>
        <div className="col-12 col-sm-11">
          <h1 className="text-center mb-4">IoT Счетчики</h1>
        </div>
      </div>

      <div className="row g-4">
        {meters.map((meter, index) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={index}>
            <Link to={`/app/meter/${meter.type}/${meter.name ? meter.name : "-1"}`}>
              <Meter
                title={meter.title}
                value={meter.value}
                index={index}
                key={index}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
