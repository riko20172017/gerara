import useWebSocket, { ReadyState } from "react-use-websocket";
import React, { useState, useEffect } from "react";
import InputTimer from "../components/InputTimer";
import "bootstrap/dist/css/bootstrap.min.css";

function Valves() {
  const [periods, setPeriods] = useState({ length: 0, periods: [] });

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
        {/* <div className="mt-4 text-center">
					<h5>
						Общее время полива:{" "}
						{valves.reduce(
							(total, valve) => total + valve.time,
							0
						)}{" "}
						минут
					</h5>
				</div> */}
      </div>
    </div>
  );
}

export default Valves;
