import { useContext } from "react";
import WebSocketContext from "./WebSocketContext";

export const useValves = () => useContext(WebSocketContext).valves;

export const usePamps = () => useContext(WebSocketContext).pamps;

export const usePeriods = () => useContext(WebSocketContext).periods;

export const useMeters = () => useContext(WebSocketContext).meters;

export const useMeter = () => useContext(WebSocketContext).meter;

export const useWSSend = () => useContext(WebSocketContext).send;

export const useReady = () => useContext(WebSocketContext).readyState;
