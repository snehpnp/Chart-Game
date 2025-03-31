import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const CandlestickChart = () => {
  const [data, setData] = useState([]);
  const [liveCryptoPrice, setLiveCryptoPrice] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:6767");

    socket.onopen = () => {
      console.log("📡 Connected to WebSocket");
    };

    socket.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);

        // Ensure data is structured properly
        const formattedData = newData.map((entry) => ({
          x: new Date(entry[2]).getTime(), // Convert to timestamp
          y: [entry[5] - 1, entry[5] + 10, entry[5] - 9, entry[5]], // [Open, High, Low, Close]
        }));

        setLiveCryptoPrice(formattedData[formattedData.length - 1].y[3]); // Last close price

        setData((prevData) => {
          const updatedData = [...prevData, ...formattedData].slice(-50); // Keep last 50 records
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

  const options = {
    chart: {
      type: "candlestick",
      height: 350,
    },
    title: {
      text: "Live Crypto Candlestick Chart",
      align: "left",
    },
xaxis: {
  type: "datetime",
  labels: {
    format: "HH:mm:ss",
  },
},


    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  };

  console.log("Live Crypto Price:", data);

  return (
    <div className="chart">
      <h3>
        Live Crypto Price:{" "}
        {liveCryptoPrice ? `$${liveCryptoPrice}` : "Loading..."}
      </h3>
      <Chart
        options={options}
        series={[{ data }]}
        type="candlestick"
        height={350}
      />
    </div>
  );
};

export default CandlestickChart;
