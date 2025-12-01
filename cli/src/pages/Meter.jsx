import React, { useContext, useState, useEffect } from "react";
import WebSocketContext from "../websocket/WebSocketContext";
import Back from "../components/gui/Back/Back";
import { useParams } from "react-router-dom";

export default function Meter() {
  const { send, message, readyState } = useContext(WebSocketContext);
  const [meter, setMeter] = useState([]);
  const { meterType, meterName } = useParams();

  // Handle WebSocket connection state
  useEffect(() => {
    if (readyState === 1) {
      console.log("1");
      send({
        event: "get/meter/request",
        data: { type: meterType, name: meterName },
      });
    }
  }, [readyState]);

  if (message.event === "get/meter/response") {
    console.log(message);
  }
  // Handle incoming WebSocket messages
  // useEffect(() => {
  //   console.log('2')
  //   if (message) {
  //     if (message.event === "get/meter/response") {
  //       setMeter([...message.data]);
  //     }
  //   }
  // }, [message]);

  return (
    <div className="py-4">
      <div className="row">
        <div className="col-12 col-sm-1">
          <Back></Back>
        </div>
        <div className="col-12 col-sm-11">
          <h1 className="text-center mb-4">Датчик</h1>
        </div>
      </div>
    </div>
  );
}
