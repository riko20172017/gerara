import useWebSocket, { ReadyState } from "react-use-websocket";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Valves() {
	const [valves, setValves] = useState([]);
	const WS_URL = `ws://${process.env.REACT_APP_API_IP}:7000`;
	const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
		WS_URL,
		{
			share: false,
			shouldReconnect: () => true,
		}
	);

	// Handle WebSocket connection state
	useEffect(() => {
		if (readyState === ReadyState.OPEN) {
			sendJsonMessage({
				event: "get/valves/time/request", data: {}
			});
		}
	}, [readyState]);

	//Handle incoming WebSocket messages
	useEffect(() => {
		if (lastJsonMessage) {
			if (lastJsonMessage.event === "get/valves/time/response")
				setValves([...lastJsonMessage.data]); // Assuming the response is an array of objects
				console.log(lastJsonMessage.data);
				
		}
	}, [lastJsonMessage]);

	const handleTimeChange = (index, type, value) => {
		const updatedTimes = [...valves];
		updatedTimes[index - 1].time = value;
		// setValves(updatedTimes);

	};

	const saveTime = (index) => {
		const time = valves[index - 1].time;
		sendJsonMessage({
			event: "set/valve/time/request",
			data: {
				valve: index,
				time,
			}
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
								<span className="me-2">Клапанная группа {valve}</span>
								<span className="badge bg-secondary">{time}</span>
							</div>
							<div className="d-flex align-items-center">
								<input
									type="number"
									className="form-control me-2"
									style={{ width: "80px" }}
									placeholder="Минуты"
									// value={time}
									onChange={(e) => handleTimeChange(valve, "time", parseInt(e.target.value) || 0)}
									min="0"
									max="300"
								/>
								<button className="btn btn-primary" onClick={() => saveTime(valve)}>
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