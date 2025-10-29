import React, { useMemo } from "react";
import useWebSocket from "react-use-websocket";
import WebSocketContext from "./WebSocketContext";

const API_DOMAIN =
  process.env.REACT_APP_ENV === "remote" ? "gerara.ru" : "localhost";

console.log("REACT_APP_ENV:", process.env.REACT_APP_ENV);

const WS_URL = `ws://${API_DOMAIN}/ws/`; // пример, замените на свой

export const WebSocketProvider = ({ children }) => {
  const {
    sendJsonMessage: send,
    lastJsonMessage: message,
    readyState,
  } = useWebSocket(WS_URL, { share: false, shouldReconnect: () => true });

  const value = useMemo(
    () => ({
      send,
      message,
      readyState,
    }),
    [send, message, readyState]
  );

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
