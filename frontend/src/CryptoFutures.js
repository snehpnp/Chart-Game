import React, { useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import Chart from "./Chart";
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
import Swal from "sweetalert2";

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
  const [betActive, setBetActive] = useState(true);
  const [seconds, setSeconds] = useState(new Date().getSeconds());
  const [userBet, setUserBet] = useState(null); // 'UP' or 'DOWN'
  const [betPrice, setBetPrice] = useState(null);
  const [betResponse, setBetResponse] = useState([]);
  const [betAmount, setBetAmount] = useState(10);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:6767");

    socket.onopen = () => {
      console.log("📡 Connected to WebSocket");
    };

    socket.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);

        // Optional: Update live crypto price display
        const formattedData = newData.map((entry) => ({
          time: new Date(entry[2]).toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour12: false,
          }),
          price: entry[5],
        }));

        setLiveCryptoPrice(formattedData.at(-1)?.price);

        // setData((prevData) => [...prevData, ...formattedData].slice(-30));
      } catch (error) {
        console.error("❌ Error parsing WebSocket data:", error);
      }
    };

    socket.onclose = () => console.warn("🔌 WebSocket Disconnected");
    socket.onerror = (err) => console.error("❌ WebSocket Error:", err);

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const sec = now.getSeconds();
      setSeconds(sec);

      if (sec === 0) {
        setBetActive((prev) => !prev);
      } else if (sec === 10) {
        setBetActive((prev) => !prev);
      } else if (sec === 20) {
        setBetActive((prev) => !prev);

        checkBetResult();
      } else if (sec === 30) {
        setBetActive((prev) => !prev);
      } else if (sec === 40) {
        setBetActive((prev) => !prev);

        checkBetResult();
      } else if (sec === 50) {
        setBetActive((prev) => !prev);
      } else if (sec === 59) {
        checkBetResult();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  const placeBet = (betType) => {
    // if (!betActive) return;
    console.log("Placing bet:", betType);
    setBetPrice(LiveCryptoPrice);
    setUserBet(betType);
  };

  const checkBetResult = () => {
    if (!userBet || betPrice === null) return;

    if (userBet === "UP" && LiveCryptoPrice > betPrice) {
      // alert("🎉 You Win! Market went up.");
      Swal.fire({ title: "You Win! Market went up.", icon: "success" });
      setBetResponse((prev) => [
        ...prev,
        {
          Amount: betAmount * 2,
          type: "WIN",
          title: "You Win! Market went up.",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } else if (userBet === "DOWN" && LiveCryptoPrice < betPrice) {
      // alert("🎉 You Win! Market went down.");
      Swal.fire({ title: "You Win! Market went down.", icon: "success" });
      setBetResponse((prev) => [
        ...prev,
        {
          Amount: betAmount * 2,
          type: "WIN",
          title: "You Win! Market went down.",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } else {
      // alert("❌ You Lost! Market moved opposite.");
      Swal.fire({ title: "You Lost! Market moved opposite.", icon: "error" });
      setBetResponse((prev) => [
        ...prev,
        {
          Amount: betAmount,
          type: "LOST",
          title: "You Lost! Market moved opposite.",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }

    // Reset Bet
    setUserBet(null);
    setBetPrice(null);
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
                {/* <Line data={chartData} options={options} /> */}

                {/* <div>
                  <div id="chart">
                    <ReactApexChart
                      options={state.options}
                      series={state.series}
                      type="candlestick"
                      height={350}
                    />
                  </div>
                  <div id="html-dist"></div>
                </div> */}

                <Chart />
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="md:col-span-3 bg-gray-900 rounded-lg p-4">
            <div className="mb-4 text-center">
              <h2 className="text-lg font-bold">Timer</h2>
              <div
                className="text-4xl font-mono bg-gray-800 py-2 rounded"
                style={{ color: "#4CAF50" }}
              >
                {`00:${seconds < 10 ? `0${seconds}` : seconds}`}
              </div>
              <p className="text-sm mt-2">
                {betActive
                  ? "Place your bet now!"
                  : seconds < 30
                  ? "Betting will open soon..."
                  : "Betting is closed."}
              </p>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <i className="bi bi-currency-ethereum text-blue-500 mr-2"></i>
                <span>Bet Price</span>
              </div>
              <span className="text-green-500">{`$ ${
                betPrice ? betPrice : LiveCryptoPrice
              }`}</span>
            </div>

            <div className="flex gap-2 mb-4">
              <button className="flex-1 bg-gray-800 py-2 rounded">
                MANUAL
              </button>
              <button className="flex-1 bg-gray-800 py-2 rounded">AUTO</button>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                className={`flex-1 py-2 rounded ${
                  betActive ? "bg-green-500" : "bg-gray-600 cursor-not-allowed"
                }`}
                onClick={() => placeBet("UP")}
                disabled={!betActive}
              >
                UP
              </button>
              <button
                className={`flex-1 py-2 rounded ${
                  betActive ? "bg-red-500" : "bg-gray-600 cursor-not-allowed"
                }`}
                onClick={() => placeBet("DOWN")}
                disabled={!betActive}
              >
                DOWN
              </button>
            </div>

            <div className="mb-4">
              <label className="block mb-2">AMOUNT</label>
              <input
                type="number"
                defaultValue="10"
                className="w-full bg-gray-800 p-2 rounded"
                onChange={(e) => setBetAmount(e.target.value || 0)}
                disabled={!betActive}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button className="bg-gray-800 px-3 py-1 rounded">Max</button>
                <button className="bg-gray-800 px-3 py-1 rounded">1/2</button>
                <button className="bg-gray-800 px-3 py-1 rounded">x2</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <div className="bg-gray-900 rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4">Bet History</h2>
          <div className="space-y-2">
            {betResponse.map((bet, index) => (
              <div
                key={index}
                className={`flex justify-between p-2 rounded ${
                  bet.type === "WIN" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                <span>{index + 1}</span>

                <span>{bet.title}</span>
                <span>{bet.time}</span>
                <span>
                  {bet.type == "WIN" ? bet.Amount : "-" + bet.Amount}{" "}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoFutures;
