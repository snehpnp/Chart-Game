import React, { useEffect, useState, useRef } from "react";
import { AgCharts } from "ag-charts-react";
import "ag-charts-enterprise";

const ChartExample = () => {
  const [data, setData] = useState([]);
  const [liveCryptoPrice, setLiveCryptoPrice] = useState(null);
  const socketRef = useRef(null); // ✅ Store WebSocket instance

  const [options, setOptions] = useState({
    title: { text: "Live Crypto Candlestick Chart" },
    subtitle: { text: "Real-time Price Updates" },
    series: [
      {
        type: "candlestick",
        xKey: "date",
        xName: "Date",
        lowKey: "low",
        highKey: "high",
        openKey: "open",
        closeKey: "close",
      },
    ],
    navigator: { enabled: true },
    zoom: { enabled: true, range: [0.1, 2] },
    data: [], // ✅ Ensure data is included
  });

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:6767");

    socketRef.current.onopen = () => console.log("📡 Connected to WebSocket");
    socketRef.current.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        const formattedData = newData.map((entry) => ({
          date: new Date(entry[2]),
          low: entry[5] - 1,
          high: entry[5] + 10,
          open: entry[5] - 9,
          close: entry[5],
          volume: entry[5] * 1000,
        }));

        if (formattedData.length > 0) {
          setLiveCryptoPrice(formattedData[formattedData.length - 1].close);
          setData((prevData) => [...prevData, ...formattedData].slice(-50));
        }
      } catch (error) {
        console.error("❌ Error parsing data:", error);
      }
    };

    socketRef.current.onclose = () => console.warn("🔌 WebSocket Disconnected");
    socketRef.current.onerror = (err) => console.error("❌ WebSocket Error:", err);

    return () => {
      socketRef.current?.close();
    };
  }, []);

  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      data: data, // ✅ Update chart options when data changes
    }));
  }, [data]);

  return (
    <div>
      <h2>Live Crypto Price: {liveCryptoPrice ? `$${liveCryptoPrice}` : "Loading..."}</h2>
      <AgCharts options={options} />
    </div>
  );
};

export default ChartExample;
