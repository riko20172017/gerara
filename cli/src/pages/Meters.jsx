import React, { useEffect } from "react";
import Meter from "../components/Meter/meter";
import Back from "../components/gui/Back/Back";
import { Link } from "react-router-dom";
import { useMeters, useReady, useWSSend } from "../websocket/WsSelectors";

export default function Meters() {
  const meters = useMeters();
  const send = useWSSend();
  const ready = useReady();

  //Handle WebSocket connection state
  useEffect(() => {
    if (ready) {
      const timerId = setInterval(() => {
        send({ action: "get_meters" });
      }, 10000);
      return () => {
        clearTimeout(timerId);
      };
    }
  });

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
            <Link
              to={`/app/meter/${meter.type}/${meter.name ? meter.name : "-1"}`}
            >
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
