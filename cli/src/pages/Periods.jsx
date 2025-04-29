import React, { useContext, useState, useEffect } from 'react';
import WebSocketContext from '../websocket/WebSocketContext';
import InputTimer from "../components/InputTimer";

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
    <div className="container mt-5">
      <header className="text-center mb-4">
        <h1>Периоды</h1>
      </header>
      <div>
        <div className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div className="d-flex align-items-center mb-2 mb-md-0">
            <h4 className="me-2">Количество периодов</h4>
          </div>
          <InputTimer
            avalue={periods.length}
            itemId={0}
            handleClick={handlePeriodLength}
            state={0}
            min={1}
            max={5}
            type="number"
          />
        </div>
        <ul className="list-group">
          {periods.periods.map(({ name, value }, index) => (
            <li
              key={index}
              className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center mb-2 mb-md-0">
                <h4 className="me-2">Период {name}</h4>
              </div>
              <InputTimer
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
  );
}

export default Valves;
