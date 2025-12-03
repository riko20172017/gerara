import React, { useEffect } from "react";
import Back from "../components/gui/Back/Back";
import pumpImg from "../components/Pump/pump.png";
import valveImg from "../components/Valve/valve.png";
import { usePamps, useReady, useWSSend } from "../websocket/WsSelectors";

function Pampes() {
  const data = usePamps();
  const send = useWSSend();
  const ready = useReady();

  //Handle WebSocket connection state
  useEffect(() => {
    if (ready) {
      const timerId = setInterval(() => {
        send({ action: "get_pamps" });
      }, 1000);
      return () => {
        clearTimeout(timerId);
      };
    }
  });

  const handleClickPamp = (name, value) => {
    send({
      action: "set_pamp",
      data: { name, value },
    });
  };

  const handleClickValve = (name, value) => {
    send({
      action: "set_valve_status",
      data: { name, value },
    });
  };

  const handleClickAvtomat = (name, value) => {
    send({
      action: "set_avtomat",
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
          <div className="col mb-3">
            <div className="card align-items-center border-0">
              <div className="card-body">
                <h5 className="card-title">
                  <div
                    className="alert text-bg-dark"
                    style={{ fontSize: "12px" }}
                    role="alert"
                  >
                    {data?.avtomat?.status === "automatic" &&
                      "Система на автомате"}{" "}
                    {data?.avtomat?.status === "not automatic" &&
                      " Система на ручном"}{" "}
                  </div>
                </h5>

                <div className="d-grid gap-1 gap-1">
                  <button
                    type="button"
                    className="btn btn-primary p-1"
                    style={{ fontSize: "12px" }}
                    onClick={() =>
                      handleClickAvtomat(data?.avtomat.name, "p11")
                    }
                  >
                    Авто
                  </button>
                  <button
                    type="button"
                    style={{ fontSize: "12px" }}
                    className="btn btn-danger p-1"
                    onClick={() =>
                      handleClickAvtomat(data?.avtomat.name, "p22")
                    }
                  >
                    Ручное
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-sm-3 row-cols-md-3 g-2">
          {data?.pamps?.map(({ name, value }, i) => (
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
          {data?.valves?.map(({ name, status }, i) => (
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
