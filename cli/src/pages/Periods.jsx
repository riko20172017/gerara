import React, { useEffect } from "react";
import InputTimer from "../components/InputTimer";
import Back from "../components/gui/Back/Back";
import { usePeriods, useWSSend, useReady } from "../websocket/WsSelectors";

function Valves() {
  const periods = usePeriods();
  const send = useWSSend();
  const ready = useReady();

  //Handle WebSocket connection state
  useEffect(() => {
    if (ready) {
      const timerId = setInterval(() => {
        send({ action: "get_periods" });
      }, 1000);
      return () => {
        clearTimeout(timerId);
      };
    }
  });

  const handlePeriodLength = (name, value) => {
    send({
      action: "set_periods",
      data: value,
    });
  };

  const handlePeriods = (name, value) => {
    send({
      action: "set_period",
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
            {periods?.periods?.map(({ name, value }, index) => (
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
