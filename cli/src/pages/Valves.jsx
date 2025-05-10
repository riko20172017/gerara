import React, { useState, useEffect, useContext } from "react";
import WebSocketContext from "../websocket/WebSocketContext";
import InputTimer from "../components/InputTimer";
import Back from "../components/gui/Back/Back";

function Valves() {
  const { send, message, readyState } = useContext(WebSocketContext);
  const [valves, setValves] = useState([]);

  // Handle WebSocket connection state
  useEffect(() => {
    if (readyState === 1) {
      send({
        event: "get/valves/request",
        data: {},
      });
    }
  }, [readyState]);

  //Handle incoming WebSocket messages
  useEffect(() => {
    if (message && message.event && message.data) {
      const { event, data } = message;
      if (event === "get/valves/response") setValves([...data]); // Assuming the response is an array of objects
      if (event === "valve/time") {
        const nextValves = valves.map((v, i) => {
          if (v.name === data.name) {
            return data;
          } else {
            return v;
          }
        });
        setValves(nextValves);
      }
    }
  }, [message]);

  const handleClick = (name, time) => {
    send({
      event: "set/valve/time/request",
      data: { name, time },
    });
  };

  return (
    <div>
      <header className="text-center mb-4">
        <div className="d-flex flex-column justify-content-sm-between align-items-stretch flex-sm-row text-light gap-1">
          <Back></Back>
          <h2
            className="flex-fill display-6 text-light bg-dark m-0 pb-2"
            style={{ fontSize: "24px" }}
          >
            Длительность полива
          </h2>
        </div>
      </header>
      <div>
        <ul className="list-group">
          {valves.map(({ name, time }, index) => (
            <li
              key={index}
              className="list-group-item d-flex flex-column align-items-center align-items-sm-stretch p-0 mb-1"
            >
              <InputTimer
                label={`Клапанная группа ${name}`}
                avalue={time}
                itemId={name}
                handleClick={handleClick}
                min={0}
                max={300}
                state={0}
              />
            </li>
          ))}
        </ul>
        <div className="text-left">
          <div className="d-flex flex-column flex-sm-row text-light gap-1">
            <span
              className="flex-fill text-light bg-dark m-0 p-2"
            >
              Общее время полива:{" "}
              {valves.reduce(
                (total, valve) => parseInt(total) + parseInt(valve.time),
                0
              )}{" "}
              минут
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Valves;
