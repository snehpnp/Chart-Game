import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';


const LiveCandlestickChart = () => {
    const chartContainerRef = useRef();
    const chartRef = useRef();
    const candleSeriesRef = useRef();
    


  useEffect(() => {
    const socket = new WebSocket("ws://localhost:6767");

    socket.onopen = () => {
      console.log("📡 Connected to WebSocket");
    };

    socket.onmessage = (event) => {
      try {
        const entry = JSON.parse(event.data);
        // console.log("📡 WebSocket Message:", entry);  

//     {
//     "time": 1747201681,
//     "open": 102.47,
//     "high": 102.9,
//     "low": 102.05,
//     "close": 102.76,
//     "_internal_originalTime": 1747201681
// }


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
        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 300,
            layout: {
                background: { color: '#ffffff' },
                textColor: '#000'
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

        let lastClose = 100;

        const interval = setInterval(() => {
            const open = lastClose;
            const close = open + (Math.random() * 4 - 2);
            const high = Math.max(open, close) + Math.random() * 1;
            const low = Math.min(open, close) - Math.random() * 1;

            const newCandle = {
                time: Math.floor(Date.now() / 1000),
                open: Number(open.toFixed(2)),
                high: Number(high.toFixed(2)),
                low: Number(low.toFixed(2)),
                close: Number(close.toFixed(2)),
            };

            lastClose = newCandle.close;

            console.log("New candle data:", newCandle);
            candleSeries.update(newCandle);
        }, 1000);


        return () => {
            clearInterval(interval);
            chart.remove();
        };
    }, []);

    return <div ref={chartContainerRef} style={{ width: '100%', height: '300px' }} />;
};

export default LiveCandlestickChart;