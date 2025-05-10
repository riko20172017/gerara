import React, { useContext, useState, useEffect } from "react";
import WebSocketContext from "../websocket/WebSocketContext";
import InputTimer from "../components/InputTimer";
import Back from "../components/gui/Back/Back";

function Valves() {
  const { send, message, readyState } = useContext(WebSocketContext);
  const [periods, setPeriods] = useState({ length: 0, periods: [] });

  // Handle WebSocket connection state
  useEffect(() => {
    if (readyState === 1) {
      send({
        event: "get/periods/request",
      });
    }
  }, [readyState]);

  //Handle incoming WebSocket messages
  useEffect(() => {
    if (message && message.event && message.data) {
      const { event, data } = message;
      if (event === "periods/number") {
        setPeriods((prev) => ({
          ...prev,
          length: data,
        }));
      }

      if (event === "get/periods/response") {
        setPeriods(data);
      }

      if (event === "set/period/response") {
        setPeriods((prev) => ({
          ...prev,
          periods: prev.periods.map((period) =>
            period.name === data.name
              ? { ...period, value: data.value }
              : period
          ),
        }));
      }
    }
  }, [message]);

  const handlePeriodLength = (name, value) => {
    send({
      event: "set/periods/number",
      data: value,
    });
  };

  const handlePeriods = (name, value) => {
    send({
      event: "set/period/request",
      data: { name, value },
    });
  };

  return (
    <div>
      <header className="text-center mb-4">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center text-light gap-1">
          <Back></Back>
          <div className="flex-fill">
            <InputTimer
              label="Количество периодов"
              avalue={periods.length}
              itemId={0}
              handleClick={handlePeriodLength}
              state={0}
              min={1}
              max={5}
              type="number"
            />
          </div>
        </div>
      </header>
      <div className="row align-items-start gx-1">
        <div className="col-3 d-none d-sm-block">
          <h1 className="text-center mb-4 text-light bg-dark">Герара</h1>
        </div>
        <div className="col-12 col-sm-9">
          <ul className="text-light m-0 p-0">
            {periods.periods.map(({ name, value }, index) => (
              <li
                key={index}
                className="list-group-item d-flex flex-column align-items-center align-items-sm-stretch"
              >
                <InputTimer
                  label={`Период ${name}`}
                  type="time"
                  avalue={value}
                  itemId={name}
                  handleClick={handlePeriods}
                  min="0:0"
                  max="23:59"
                  state="00:00"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default Valves;
