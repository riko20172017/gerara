import { useContext } from "react";
import WebSocketContext from "./WebSocketContext";

export const useValves = () => useContext(WebSocketContext).valves;

export const usePressure = () => useContext(WebSocketContext).pressure;

export const useHumidity = () => useContext(WebSocketContext).humidity;

export const useAlerts = () => useContext(WebSocketContext).alerts;

export const useWSSend = () => useContext(WebSocketContext).send;

export const useReady = () => useContext(WebSocketContext).readyState;
