import useWebSocket, { ReadyState } from "react-use-websocket";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Valves() {
  const [disabled, setDisabled] = useState([]);
  const [valves, setValves] = useState([]);

  const WS_URL = `ws://${process.env.REACT_APP_API_IP}:7000`;
  const {
    sendJsonMessage: send,
    lastJsonMessage: message,
    readyState,
  } = useWebSocket(WS_URL, {
    share: false,
    shouldReconnect: () => true,
  });

  // Handle WebSocket connection state
  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      send({
        event: "get/valves/time/request",
        data: {},
      });
    }
  }, [readyState]);

  //Handle incoming WebSocket messages
  useEffect(() => {
    if (message && message.event && message.data) {
      const { event, data } = message;
      console.log(event, data);
      if (event === "get/valves/time/response") setValves([...data]); // Assuming the response is an array of objects
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
        <h1>Насосы</h1>
      </header>
      <div>
        <ul className="list-group">
          {valves.map(({ name, time }, index) => (
            <li
              key={index}
              className="list-group-item d-flex flex-row flex-md-row justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center mb-2 mb-md-0">
                <h4 className="me-2 position-relative">
                  Насос {name}
                </h4>
              </div>
              <div>
                {/* <button type="button" class="btn btn-primary">
                  Вкл
                </button> */}
                <button type="button" class="btn btn-light">
                  Выкл
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Valves;
