import React, { useEffect, useMemo, useState } from "react";
import useWebSocket from "react-use-websocket";
import WebSocketContext from "./WebSocketContext";

console.log("process.env.NODE_ENV", process.env.NODE_ENV);
console.log("process.env.REACT_APP_ENV", process.env.REACT_APP_ENV);

let mode = process.env.NODE_ENV;
let env = process.env.REACT_APP_ENV;

const API_PROTOCOL = mode === "production" ? "wss" : "ws";
const API_DOMAIN = env === "remote" ? "gerara.ru" : "localhost";

const WS_URL = `${API_PROTOCOL}://${API_DOMAIN}/ws/`; // пример, замените на свой

export const WebSocketProvider = ({ children }) => {
  const {
    sendJsonMessage: send,
    lastJsonMessage: message,
    readyState,
  } = useWebSocket(WS_URL, { share: false, shouldReconnect: () => true });

  const [data, setData] = useState({
    valves: [],
    pressure: null,
    humidity: null,
    alerts: null,
  });

  useEffect(() => {
    if (!message) return;

    switch (message.event) {
      case "valves":
        setData((prev) => ({ ...prev, valves: message.data }));
        break;

      default:
    }
  }, [message]);

  const value = useMemo(
    () => ({
      send,
      readyState,
      ...data,
    }),
    [send, readyState, data]
  );
  // console.log(JSON.stringify(data.valves, null, 2));

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
