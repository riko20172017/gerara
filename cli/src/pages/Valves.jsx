import useWebSocket, { ReadyState } from "react-use-websocket";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Valves() {
	const [disabled, setDisabled] = useState([]);
	const [valves, setValves] = useState([]);

	const WS_URL = `ws://${process.env.REACT_APP_API_IP}:7000`;
	const { sendJsonMessage: send, lastJsonMessage: message, readyState, } = useWebSocket(
		WS_URL,
		{
			share: false,
			shouldReconnect: () => true,
		}
	);

	// Handle WebSocket connection state
	useEffect(() => {
		if (readyState === ReadyState.OPEN) {
			send({
				event: "get/valves/time/request", data: {}
			});
		}
	}, [readyState]);

	//Handle incoming WebSocket messages
	useEffect(() => {
		if (message && message.event && message.data) {
			const { event, data } = message;
			if (event === "get/valves/time/response")
				setValves([...data]); // Assuming the response is an array of objects
			if (event === "valve/time") {
				setValves((prev) =>
					prev.map((item) =>
						item.valve === data.name ? { ...item, time: data.time } : item
					)
				);
				setDisabled((prev) => {
					const newDisabled = [...prev];
					newDisabled[data.name] = false;
					return newDisabled;
				})
			}
		}
	}, [message]);

	const handleTimeChange = (index, value) => {
		setDisabled((prev) => {
			const newDisabled = [...prev];
			newDisabled[index] = false;
			console.log(valves, value);

			if (valves[index - 1].time == value) {
				newDisabled[index] = true;
			}
			return newDisabled;
		})
	};

	const saveTime = (index) => {
		const time = valves[index - 1].time;
		send({
			event: "set/valve/time/request",
			data: {
				valve: index,
				time,
			}
		})

		setDisabled((prev) => {
			const newDisabled = [...prev];
			newDisabled[index] = true;
			return newDisabled;
		})
	};

	return (
		<div className="container mt-5">
			<header className="text-center mb-4">
				<h1>Длительность полива</h1>
			</header>
			<div>
				<ul className="list-group">
					{valves.map(({ valve, time }, index) => (
						<li
							key={index}
							className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-center"
						>
							<div className="d-flex align-items-center mb-2 mb-md-0">
								<h4 className="me-2">Клапанная группа {valve}</h4>
							</div>
							<div className="d-flex align-items-center input-group-lg">
								<span className="input-group-text justify-content-center me-1" id="inputGroup-sizing-lg" style={{ width: "100px" }}>{time}</span>
								<input
									type="number"
									className="form-control justify-content-center me-1"
									style={{ width: "100px" }}
									placeholder="Минуты"
									// value=""
									onChange={(e) => handleTimeChange(valve, parseInt(e.target.value) || 0)}
									min="0"
									max="300"
								/>
								<button className="btn btn-primary" onClick={() => saveTime(valve)} disabled={disabled[valve]}>
									Сохранить
								</button>
							</div>
						</li>
					))}
				</ul>
				{/* <div className="mt-4 text-center">
					<h5>
						Общее время полива:{" "}
						{times.reduce(
							(total, time) => total + time,
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