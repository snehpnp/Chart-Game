import React, { useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";

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

  const [state, setState] = React.useState({
    series: [
      {
        data: [{
                  x: new Date(1538778600000),
                  y: [6629.81, 6650.5, 6623.04, 6633.33]
                },
                {
                  x: new Date(1538780400000),
                  y: [6632.01, 6643.59, 6620, 6630.11]
                },
                {
                  x: new Date(1538782200000),
                  y: [6630.71, 6648.95, 6623.34, 6635.65]
                },
                {
                  x: new Date(1538784000000),
                  y: [6635.65, 6651, 6629.67, 6638.24]
                },
                {
                  x: new Date(1538785800000),
                  y: [6638.24, 6640, 6620, 6624.47]
                },
                {
                  x: new Date(1538787600000),
                  y: [6624.53, 6636.03, 6621.68, 6624.31]
                },
                {
                  x: new Date(1538789400000),
                  y: [6624.61, 6632.2, 6617, 6626.02]
                },
                {
                  x: new Date(1538791200000),
                  y: [6627, 6627.62, 6584.22, 6603.02]
                },
                {
                  x: new Date(1538793000000),
                  y: [6605, 6608.03, 6598.95, 6604.01]
                },
                {
                  x: new Date(1538794800000),
                  y: [6604.5, 6614.4, 6602.26, 6608.02]
                },
                {
                  x: new Date(1538796600000),
                  y: [6608.02, 6610.68, 6601.99, 6608.91]
                },
                {
                  x: new Date(1538798400000),
                  y: [6608.91, 6618.99, 6608.01, 6612]
                },
                {
                  x: new Date(1538800200000),
                  y: [6612, 6615.13, 6605.09, 6612]
                },
                {
                  x: new Date(1538802000000),
                  y: [6612, 6624.12, 6608.43, 6622.95]
                },
                {
                  x: new Date(1538803800000),
                  y: [6623.91, 6623.91, 6615, 6615.67]
                },
                {
                  x: new Date(1538805600000),
                  y: [6618.69, 6618.74, 6610, 6610.4]
                },
                {
                  x: new Date(1538807400000),
                  y: [6611, 6622.78, 6610.4, 6614.9]
                },
                {
                  x: new Date(1538809200000),
                  y: [6614.9, 6626.2, 6613.33, 6623.45]
                },
                {
                  x: new Date(1538811000000),
                  y: [6623.48, 6627, 6618.38, 6620.35]
                },
                {
                  x: new Date(1538812800000),
                  y: [6619.43, 6620.35, 6610.05, 6615.53]
                },
                {
                  x: new Date(1538814600000),
                  y: [6615.53, 6617.93, 6610, 6615.19]
                },
                {
                  x: new Date(1538816400000),
                  y: [6615.19, 6621.6, 6608.2, 6620]
                },
                {
                  x: new Date(1538818200000),
                  y: [6619.54, 6625.17, 6614.15, 6620]
                },
                {
                  x: new Date(1538820000000),
                  y: [6620.33, 6634.15, 6617.24, 6624.61]
                },
                {
                  x: new Date(1538821800000),
                  y: [6625.95, 6626, 6611.66, 6617.58]
                },
                {
                  x: new Date(1538823600000),
                  y: [6619, 6625.97, 6595.27, 6598.86]
                },
                {
                  x: new Date(1538825400000),
                  y: [6598.86, 6598.88, 6570, 6587.16]
                },
                {
                  x: new Date(1538827200000),
                  y: [6588.86, 6600, 6580, 6593.4]
                },
                {
                  x: new Date(1538829000000),
                  y: [6593.99, 6598.89, 6585, 6587.81]
                },
                {
                  x: new Date(1538830800000),
                  y: [6587.81, 6592.73, 6567.14, 6578]
                },
                {
                  x: new Date(1538832600000),
                  y: [6578.35, 6581.72, 6567.39, 6579]
                },
                {
                  x: new Date(1538834400000),
                  y: [6579.38, 6580.92, 6566.77, 6575.96]
                },
                {
                  x: new Date(1538836200000),
                  y: [6575.96, 6589, 6571.77, 6588.92]
                },
                {
                  x: new Date(1538838000000),
                  y: [6588.92, 6594, 6577.55, 6589.22]
                },
                {
                  x: new Date(1538839800000),
                  y: [6589.3, 6598.89, 6589.1, 6596.08]
                },
                {
                  x: new Date(1538841600000),
                  y: [6597.5, 6600, 6588.39, 6596.25]
                },
                {
                  x: new Date(1538843400000),
                  y: [6598.03, 6600, 6588.73, 6595.97]
                },
                {
                  x: new Date(1538845200000),
                  y: [6595.97, 6602.01, 6588.17, 6602]
                },
                {
                  x: new Date(1538847000000),
                  y: [6602, 6607, 6596.51, 6599.95]
                },
                {
                  x: new Date(1538848800000),
                  y: [6600.63, 6601.21, 6590.39, 6591.02]
                },
                {
                  x: new Date(1538850600000),
                  y: [6591.02, 6603.08, 6591, 6591]
                },
                {
                  x: new Date(1538852400000),
                  y: [6591, 6601.32, 6585, 6592]
                },
                {
                  x: new Date(1538854200000),
                  y: [6593.13, 6596.01, 6590, 6593.34]
                },
                {
                  x: new Date(1538856000000),
                  y: [6593.34, 6604.76, 6582.63, 6593.86]
                },
                {
                  x: new Date(1538857800000),
                  y: [6593.86, 6604.28, 6586.57, 6600.01]
                },
                {
                  x: new Date(1538859600000),
                  y: [6601.81, 6603.21, 6592.78, 6596.25]
                },
                {
                  x: new Date(1538861400000),
                  y: [6596.25, 6604.2, 6590, 6602.99]
                },
                {
                  x: new Date(1538863200000),
                  y: [6602.99, 6606, 6584.99, 6587.81]
                },
                {
                  x: new Date(1538865000000),
                  y: [6587.81, 6595, 6583.27, 6591.96]
                },
                {
                  x: new Date(1538866800000),
                  y: [6591.97, 6596.07, 6585, 6588.39]
                },
                {
                  x: new Date(1538868600000),
                  y: [6587.6, 6598.21, 6587.6, 6594.27]
                },
                {
                  x: new Date(1538870400000),
                  y: [6596.44, 6601, 6590, 6596.55]
                },
                {
                  x: new Date(1538872200000),
                  y: [6598.91, 6605, 6596.61, 6600.02]
                },
                {
                  x: new Date(1538874000000),
                  y: [6600.55, 6605, 6589.14, 6593.01]
                },
                {
                  x: new Date(1538875800000),
                  y: [6593.15, 6605, 6592, 6603.06]
                },
                {
                  x: new Date(1538877600000),
                  y: [6603.07, 6604.5, 6599.09, 6603.89]
                },
                {
                  x: new Date(1538879400000),
                  y: [6604.44, 6604.44, 6600, 6603.5]
                },
                {
                  x: new Date(1538881200000),
                  y: [6603.5, 6603.99, 6597.5, 6603.86]
                },
                {
                  x: new Date(1538883000000),
                  y: [6603.85, 6605, 6600, 6604.07]
                },
                {
                  x: new Date(1538884800000),
                  y: [6604.98, 6606, 6604.07, 6606]
                },
              ],
      },
    ],
    options: {
      chart: {
        type: "candlestick",
        height: 350,
      },
      title: {
        text: "CandleStick Chart",
        align: "left",
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
      },
    },
  });

useEffect(() => {
  const socket = new WebSocket("ws://localhost:6767");

  socket.onopen = () => {
    console.log("📡 Connected to WebSocket");
  };

  socket.onmessage = (event) => {
    try {
      const newData = JSON.parse(event.data);

      // Filter only "Q" entries and convert to ApexCharts format
      const apexchartsData = newData
        .filter(entry => entry[0] === "Q")
        .map(entry => {
          const utcDate = new Date(entry[2]);

          // Convert to IST using native API
          const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);

          return {
            x: istDate, // or istDate.toISOString() — both work for ApexCharts
            y: [entry[5], entry[6], entry[7], entry[8]], // [Open, High, Low, Close]
          };
        });

      // Update chart series (keep only last 30 candles)
      // setState(prevState => ({
      //   ...prevState,
      //   series: [
      //     {
      //       data: [...prevState.series[0].data, ...apexchartsData].slice(-30),
      //     },
      //   ],
      // }));

      console.log("apexchartsData",apexchartsData )

      // Optional: Update live crypto price display
      const formattedData = newData.map(entry => ({
        time: new Date(entry[2]).toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
        }),
        price: entry[5],
      }));

      setLiveCryptoPrice(formattedData.at(-1)?.price);

      setData(prevData => [
        ...prevData,
        ...formattedData,
      ].slice(-30));
      
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
    console.log(
      "Checking result -> Bet:",
      userBet,
      "Price:",
      betPrice,
      "Live:",
      LiveCryptoPrice
    );
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

                <div>
                  <div id="chart">
                    <ReactApexChart
                      options={state.options}
                      series={state.series}
                      type="candlestick"
                      height={350}
                    />
                  </div>
                  <div id="html-dist"></div>
                </div>
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
