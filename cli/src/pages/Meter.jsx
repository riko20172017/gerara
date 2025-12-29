import React, { useEffect } from "react";
import Back from "../components/gui/Back/Back";
import { useParams } from "react-router-dom";
import { useMeter, useReady, useWSSend } from "../websocket/WsSelectors";

import { Line } from "react-chartjs-2"; // Импортируем компонент линии
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Регистрируем нужные модули Chart.js (обязательный шаг)
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Meter() {
  const meter = useMeter();
  const send = useWSSend();
  const ready = useReady();
  const { meterType, meterName } = useParams();

  //Handle WebSocket connection state
  useEffect(() => {
    if (ready) {
      send({
        action: "get_meter",
        data: { type: meterType, name: meterName },
      });
      const timerId = setInterval(() => {
        send({
          action: "get_meter",
          data: { type: meterType, name: meterName },
        });
      }, 10000);
      return () => {
        clearTimeout(timerId);
      };
    }
  }, [ready]);

  const data = {
    labels: meter.times,
    datasets: [
      {
        label: "Данные",
        data: meter.values, // Здесь сами значения
        fill: false, // Без заливки под кривой
        borderColor: "rgba(75,192,192,1)", // Цвет линии
        tension: 0.3, // Плавность кривой
        borderWidth: 0.8
      },
    ],
  };

  const options = {
    scales: {
      x: { title: { display: true, text: "Время" } },
      y: { title: { display: true, text: "Значение" } },
    },
    responsive: true, // Масштабируется под контейнер
    plugins: {
      legend: {
        display: true,
        position: "top", // Положение легенды
      },
      title: {
        display: true,
        text: "", // Название графика
      },
    },
  };

  console.log(meter);

  return (
    <div className="py-4">
      <div className="row">
        <div className="col-12 col-sm-1">
          <Back></Back>
        </div>
        <div className="col-12 col-sm-11">
          <h1 className="text-center mb-4">Датчик</h1>
          <Line data={data} options={options} /> {/* Рисуем! */}
        </div>
      </div>
    </div>
  );
}
