import React, { useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";

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
  const [LiveCryptoPrice, setLiveCryptoPrice] = useState();

  const [state, setState] = useState({
    series: [
      {
        // [[Timestamp], [O, H, L, C]]
        data: [],
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
      tooltip: {
        style: {
          fontSize: "14px",
          colors: ["#000"],
        },
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: "#00ff00",
            downward: "#ff0000",
          },
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
        const entry = JSON.parse(event.data);
        console.log("📡 WebSocket Message:", entry);

       
  

        // Update chart state with new data
        setState((prev) => ({
          ...prev,
          series: [
            {
              data: [...prev.series[0].data, entry].slice(-30), // Keep the last 30 data points
            },
          ],
        }));

        // Update live crypto price display
        setLiveCryptoPrice(entry.y[3]); // Close price
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

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="candlestick"
          height={350}
        />
      </div>
      <div id="live-price">
        <h3>
          Live Bitcoin Price:{" "}
          {LiveCryptoPrice ? `$${LiveCryptoPrice}` : "Loading..."}
        </h3>
      </div>
    </div>
  );
};

export default CryptoFutures;
