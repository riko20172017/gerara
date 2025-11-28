import React, { useContext, useState, useEffect } from "react";
import WebSocketContext from "../websocket/WebSocketContext";
import Back from "../components/gui/Back/Back";
import pumpImg from "../components/Pump/pump.png";
import valveImg from "../components/Valve/valve.png";

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
    <div>
      <header className="text-center mb-4">
        <Back></Back>
        <h1 className="display-3"> Управление</h1>
      </header>
      <div>
        <div className="row row-cols-1 row-cols-sm-1 row-cols-md-1 g-2">
          {/* Насосы  */}
          <div className="col mb-3">
            <div className="card align-items-center border-0">
              <div className="card-body">
                <h5 className="card-title">
                  <div
                    className="alert text-bg-dark"
                    style={{ fontSize: "12px" }}
                    role="alert"
                  >
                    {avtomat.status === "automatic" && "Система на автомате"}{" "}
                    {avtomat.status === "not automatic" && " Система на ручном"}{" "}
                  </div>
                </h5>

                <div className="d-grid gap-1 gap-1">
                  <button
                    type="button"
                    className="btn btn-primary p-1"
                    style={{ fontSize: "12px" }}
                    onClick={() => handleClickAvtomate(avtomat.name, "p11")}
                  >
                    Авто
                  </button>
                  <button
                    type="button"
                    style={{ fontSize: "12px" }}
                    className="btn btn-danger p-1"
                    onClick={() => handleClickAvtomate(avtomat.name, "p22")}
                  >
                    Ручное
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-sm-3 row-cols-md-3 g-2">
          {/* Насосы  */}

          {pamps.map(({ name, value }, i) => (
            <div className="col" key={i}>
              <div className="card align-items-center pt-2 border-0">
                <img
                  src={pumpImg}
                  className="card-img-top"
                  alt="..."
                  style={{ width: "50%" }}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {value === "on" && (
                      <span className="badge bg-success"> </span>
                    )}{" "}
                    {value === "off" && (
                      <span className="badge bg-warning"> </span>
                    )}{" "}
                  </h5>

                  <div className="btn-group-vertical gap-1">
                    <button
                      type="button"
                      className="btn btn-info p-1"
                      style={{ fontSize: "12px" }}
                      onClick={() => handleClickPamp(name, "on")}
                    >
                      Включить насос {name}
                    </button>
                    <button
                      type="button"
                      className="btn btn-info p-1"
                      style={{ fontSize: "12px" }}
                      onClick={() => handleClickPamp(name, "off")}
                    >
                      Выключить насос {name}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4 mt-3 mb-5">
          {/* Клапаны  */}
          {valves.map(({ name, status }, i) => (
            <div className="col" key={i}>
              <div className="card align-items-center border-0">
                <img
                  src={valveImg}
                  className="card-img-top"
                  alt="..."
                  style={{ width: "50%" }}
                />
                <div className="card-body p-2">
                  <h5 className="card-title">
                    {status === "on" && (
                      <span className="badge bg-success"> </span>
                    )}{" "}
                    {status === "off" && (
                      <span className="badge bg-warning"> </span>
                    )}{" "}
                  </h5>

                  <div className="btn-group-vertical gap-1">
                    <button
                      type="button"
                      className="btn btn-info p-1"
                      style={{ fontSize: "12px" }}
                      onClick={() => handleClickValve(name, "on")}
                    >
                      Включить группу {name}
                    </button>
                    <button
                      type="button"
                      className="btn btn-info p-1"
                      style={{ fontSize: "12px" }}
                      onClick={() => handleClickValve(name, "off")}
                    >
                      Выключить группу {name}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Pampes;
