import React, { useState, useEffect, useContext } from "react";
import WebSocketContext from '../websocket/WebSocketContext';
import InputTimer from "../components/InputTimer";


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
    <div className="container mt-5">
      <header className="text-center mb-4">
        <h1>Длительность полива</h1>
      </header>
      <div>
        <ul className="list-group">
          {valves.map(({ name, time }, index) => (
            <li
              key={index}
              className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center mb-2 mb-md-0">
                <h4 className="me-2">Клапанная группа {name}</h4>
              </div>
              <InputTimer
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
        <div className="mt-4 text-center">
          <h5>
            Общее время полива:{" "}
            {valves.reduce(
              (total, valve) => parseInt(total) + parseInt(valve.time),
              0
            )}{" "}
            минут
          </h5>
        </div>
      </div>
    </div>
  );
}

export default Valves;
