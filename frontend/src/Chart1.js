import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const LiveCandlestickChart = () => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const candleSeriesRef = useRef();

  useEffect(() => {
    // 1️⃣ Create chart once
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { color: 'black' },
        textColor: 'white',
      },
      grid: {
        vertLines: { color: '#eee' },
        horzLines: { color: '#eee' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    });

    const candleSeries = chart.addCandlestickSeries();
    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;

    return () => {
      chart.remove();
    };
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:6767");

    socket.onopen = () => {
      console.log("📡 Connected to WebSocket");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📈 WebSocket Data:", data);

        // 2️⃣ Support both array or single candle object
        if (Array.isArray(data)) {
          candleSeriesRef.current.setData(data); // Use setData for full series
        } else {
          candleSeriesRef.current.update(data);  // Use update for single candle
        }

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

  return <div ref={chartContainerRef} style={{ width: '100%', height: '300px' }} />;
};

export default LiveCandlestickChart;
