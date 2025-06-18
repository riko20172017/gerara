import React, { useMemo } from "react";
import useWebSocket from "react-use-websocket";
import WebSocketContext from "./WebSocketContext";

const WS_URL = `wss://gerara.ru/ws`; // пример, замените на свой

export const WebSocketProvider = ({ children }) => {
  const { sendJsonMessage: send, lastJsonMessage: message, readyState } = useWebSocket(
    WS_URL,
    { share: false, shouldReconnect: () => true }
  );

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
