import React, { useContext, useState, useEffect } from "react";
// import WebSocketContext from "../websocket/WebSocketContext";
import Back from "../components/gui/Back/Back";

function Areas() {
  // const { send, message, readyState } = useContext(WebSocketContext);
  // const [periods, setPeriods] = useState({ length: 0, periods: [] });

  // // Handle WebSocket connection state
  // useEffect(() => {
  //   if (readyState === 1) {
  //     send({
  //       event: "get/periods/request",
  //     });
  //   }
  // }, [readyState]);

  // //Handle incoming WebSocket messages
  // useEffect(() => {
  //   if (message && message.event && message.data) {
  //     const { event, data } = message;
  //     if (event === "periods/number") {
  //       setPeriods((prev) => ({
  //         ...prev,
  //         length: data,
  //       }));
  //     }

  //     if (event === "get/periods/response") {
  //       setPeriods(data);
  //     }

  //     if (event === "set/period/response") {
  //       setPeriods((prev) => ({
  //         ...prev,
  //         periods: prev.periods.map((period) =>
  //           period.name === data.name
  //             ? { ...period, value: data.value }
  //             : period
  //         ),
  //       }));
  //     }
  //   }
  // }, [message]);

  // const handlePeriodLength = (name, value) => {
  //   send({
  //     event: "set/periods/number",
  //     data: value,
  //   });
  // };

  // const handlePeriods = (name, value) => {
  //   send({
  //     event: "set/period/request",
  //     data: { name, value },
  //   });
  // };

  return (
    <div>
      <header className="text-center mb-4">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center text-light gap-1">
          <Back></Back>
        </div>
      </header>
    </div>
  );
}

export default Areas;
