import React, { useEffect, useRef, useState } from "react";

import { Line } from "react-chartjs-2";
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

// Chart.js modules register karna
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CryptoFutures = () => {
  const [data, setData] = useState([]);
  const [LiveCryptoPrice, setLiveCryptoPrice] = useState();

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:6767");

    socket.onopen = () => {
      console.log("📡 Connected to WebSocket");
    };

    socket.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);

     
        const formattedData = newData.map((entry) => ({
          time: new Date(entry[2]).toLocaleTimeString(), // Time format
          price: entry[5], // Price
        }));

        setLiveCryptoPrice(formattedData[formattedData.length-1]?.price);
        setData((prevData) => {
          const updatedData = [...prevData, ...formattedData].slice(-30); // Pichle 30 records tak limit
          return updatedData;
        });
      } catch (error) {
        console.error("❌ Error parsing data:", error);
      }
    };

    socket.onclose = () => console.warn("🔌 WebSocket Disconnected");
    socket.onerror = (err) => console.error("❌ WebSocket Error:", err);

    return () => {
      socket.close();
    };
  }, []);

  // Chart.js ke liye formatted dataset
  const chartData = {
    labels: data.map((d) => d.time),
    datasets: [
      {
        label: "Crypto Price",
        data: data.map((d) => d.price),
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        pointBackgroundColor: "#4CAF50",
        pointBorderColor: "#fff",
        tension: 0.4, // Smooth curve effect
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Chart ko responsive banane ke liye
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Time" },
        ticks: {
          autoSkip: false, // Har label ko show karne ke liye
          maxRotation: 45, // Thoda tilt karne ke liye
          minRotation: 30,
        },
      },
      y: {
        title: { display: true, text: "Price" },
        beginAtZero: false,
      },
    },
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#1a1d26", color: "#fff" }}
    >
      <div className="container mx-auto p-4">
        <header className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold flex items-center">
              <i className="bi bi-currency-bitcoin text-blue-500 mr-2"></i>
              CRYPTO FUTURES
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span>Guest-9680644</span>
            <span className="text-blue-400">25000.00</span>
            <div className="flex gap-2">
              <i className="bi bi-house"></i>
              <i className="bi bi-flag"></i>
              <i className="bi bi-volume-up"></i>
              <i className="bi bi-fullscreen"></i>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left Panel */}
          <div className="md:col-span-3 bg-gray-900 rounded-lg p-4">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search symbol"
                className="w-full bg-gray-800 p-2 rounded"
              />
            </div>
            <div className="space-y-2">
              <div className="crypto-item flex justify-between p-2 rounded">
                <div className="flex items-center">
                  <i className="bi bi-currency-bitcoin text-orange-500 mr-2"></i>
                  <span>BTC/USD</span>
                </div>
                <span>{`$ ${LiveCryptoPrice}`}</span>

              </div>
              <div className="crypto-item flex justify-between p-2 rounded">
                <div className="flex items-center">
                  <i className="bi bi-currency-ethereum text-blue-500 mr-2"></i>
                  <span>ETH/USD</span>
                </div>
                <span className="text-green-500">$2071.545</span>
              </div>
              {/* Add more crypto pairs as needed */}
            </div>
          </div>

          {/* Center Panel */}
          <div className="md:col-span-6 bg-gray-900 rounded-lg p-4">
            <div
              style={{
                width: "100%",
                overflowX: "auto",
                paddingBottom: "20px",
              }}
            >
              <h2 style={{ textAlign: "center", color: "white" }}>
                Live Crypto Price Chart
              </h2>
              <div style={{ width: "1200px", height: "400px" }}>
                <Line data={chartData} options={options} />
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="md:col-span-3 bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <i className="bi bi-currency-ethereum text-blue-500 mr-2"></i>
                <span>ETH/USD</span>
              </div>
              <span className="text-green-500">$2072.125</span>
            </div>

            <div className="flex gap-2 mb-4">
              <button className="flex-1 bg-gray-800 py-2 rounded">
                MANUAL
              </button>
              <button className="flex-1 bg-gray-800 py-2 rounded">AUTO</button>
            </div>

            <div className="flex gap-2 mb-4">
              <button className="flex-1 bg-green-500 py-2 rounded">UP</button>
              <button className="flex-1 bg-red-500 py-2 rounded">DOWN</button>
            </div>

            <div className="mb-4">
              <label className="block mb-2">AMOUNT</label>
              <input
                type="number"
                defaultValue="10"
                className="w-full bg-gray-800 p-2 rounded"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button className="bg-gray-800 px-3 py-1 rounded">Max</button>
                <button className="bg-gray-800 px-3 py-1 rounded">1/2</button>
                <button className="bg-gray-800 px-3 py-1 rounded">x2</button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2">MULTIPLIER</label>
              <input
                type="number"
                defaultValue="50"
                className="w-full bg-gray-800 p-2 rounded"
              />
            </div>

            <div className="mb-4">
              <input
                type="range"
                className="trading-slider w-full"
                min="1"
                max="100"
                defaultValue="50"
              />
              <div className="flex justify-between">
                <span>x1 • Safe</span>
                <span>Wild • x100</span>
              </div>
            </div>

            <button className="w-full bg-green-500 py-3 rounded font-bold">
              PLACE BET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoFutures;
