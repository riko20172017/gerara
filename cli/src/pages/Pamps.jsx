import React, { useContext, useState, useEffect } from 'react';
import WebSocketContext from '../websocket/WebSocketContext';

function Pampes() {
  const { send, message, readyState } = useContext(WebSocketContext);
  const [pamps, setPamps] = useState([]);
  const [valves, setValves] = useState([]);
  const [avtomat, setAvtomat] = useState({});

  // Handle WebSocket connection state
  useEffect(() => {
    if (readyState === 1) {
      send({
        event: "get/pamps/request",
      });
      send({
        event: "get/valves/request",
      });
      send({
        event: "get/avtomat/request",
      });
    }
  }, [readyState]);

  //Handle incoming WebSocket messages
  useEffect(() => {
    if (message && message.event && message.data) {
      const { event, data } = message;
      if (event === "get/pamps/response") setPamps([...data]); // Assuming the response is an array of objects
      if (event === "set/pamps/response") {
        const nextPamps = pamps.map((pamp, i) => {
          if (pamp.name === data.name) {
            return data;
          } else {
            return pamp;
          }
        });
        setPamps(nextPamps);
      }
      if (event === "get/valves/response") setValves([...data]);
      if (event === "set/valve/status/response") {
        const nextValves = valves.map((valve, i) => {
          if (valve.name === data.name) {
            return data;
          } else {
            return valve;
          }
        });
        setValves(nextValves);
      }
      if (event === "get/avtomat/response") setAvtomat({ ...data });
      if (event === "set/avtomat/status/response") {
        setAvtomat({ ...data });
      }
    }
  }, [message]);

  const handleClickPamp = (name, value) => {
    send({
      event: "set/pamp/request",
      data: { name, value },
    });
  };

  const handleClickValve = (name, value) => {
    send({
      event: "set/valve/status/request",
      data: { name, value },
    });
  };

  const handleClickAvtomate = (name, value) => {
    send({
      event: "set/avtomat/status/request",
      data: { name, value },
    });
  };

  return (
    <div className="container mt-5">
      <header className="text-center mb-4">
        <h1>Ручное управление</h1>
      </header>
      <div>
        <ul className="list-group">
          {/* Автомат */}
          <li className="list-group-item d-flex flex-row flex-md-row justify-content-between align-items-center">
            <div className="d-flex align-items-center mb-2 mb-md-0">
              <h4 className="me-2 position-relative">Автомат {avtomat.name}</h4>
            </div>
            <div>
              {avtomat.status == "on" && (
                <span className="badge bg-success"> </span>
              )}{" "}
              {avtomat.status == "off" && (
                <span className="badge bg-warning"> </span>
              )}{" "}
              {avtomat.status == "off" && (
                <button
                  type="button"
                  style={{ width: "110px" }}
                  className="btn btn-link"
                  onClick={() => handleClickAvtomate(avtomat.name, "on")}
                >
                  Включить
                </button>
              )}
              {avtomat.status == "on" && (
                <button
                  type="button"
                  style={{ width: "110px" }}
                  className="btn btn-link"
                  onClick={() => handleClickAvtomate(avtomat.name, "off")}
                >
                  Выключить
                </button>
              )}
            </div>
          </li>

          {/* Насосы  */}
          {pamps.map(({ name, value }, i) => (
            <li
              key={i}
              className="list-group-item d-flex flex-row flex-md-row justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center mb-2 mb-md-0">
                <h4 className="me-2 position-relative">Насос {name}</h4>
              </div>
              <div>
                {value == "on" && <span className="badge bg-success"> </span>}{" "}
                {value == "off" && <span className="badge bg-warning"> </span>}{" "}
                {value == "off" && (
                  <button
                    type="button"
                    style={{ width: "110px" }}
                    className="btn btn-link"
                    onClick={() => handleClickPamp(name, "on")}
                  >
                    Включить
                  </button>
                )}
                {value == "on" && (
                  <button
                    type="button"
                    style={{ width: "110px" }}
                    className="btn btn-link"
                    onClick={() => handleClickPamp(name, "off")}
                  >
                    Выключить
                  </button>
                )}
              </div>
            </li>
          ))}

          {/* Клапаны  */}

          {valves.map(({ name, status }, i) => (
            <li
              key={i}
              className="list-group-item d-flex flex-row flex-md-row justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center mb-2 mb-md-0">
                <h4 className="me-2 position-relative">Клапан {name}</h4>
              </div>
              <div>
                {status == "on" && <span className="badge bg-success"> </span>}{" "}
                {status == "off" && <span className="badge bg-warning"> </span>}{" "}
                {status == "off" && (
                  <button
                    type="button"
                    style={{ width: "110px" }}
                    className="btn btn-link"
                    onClick={() => handleClickValve(name, "on")}
                  >
                    Включить
                  </button>
                )}
                {status == "on" && (
                  <button
                    type="button"
                    style={{ width: "110px" }}
                    className="btn btn-link"
                    onClick={() => handleClickValve(name, "off")}
                  >
                    Выключить
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Pampes;
