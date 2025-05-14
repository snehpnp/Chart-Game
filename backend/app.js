const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 6767;
const API_KEY = "6c89bf7d4e3c6d0e1eff47ad7c8f8b5781ee990b";

// Store connected frontend clients
let clients = new Set();
// Store previous data (limit to last 50 entries)
let previousData = [];

// Track the last time data was sent
let lastSentTime = 0;

wss.on("connection", (ws) => {
  console.log("📡 Frontend WebSocket Connected");
  clients.add(ws);

  // Send the latest data when frontend connects
  if (previousData.length > 0) {
    ws.send(JSON.stringify(previousData.at(-1))); // Send only the latest data
  }

  ws.on("close", () => {
    console.log("🔌 Frontend WebSocket Disconnected");
    clients.delete(ws);
  });
});

// Function to connect to Tiingo WebSocket
function connectWebSocket() {
  const ws = new WebSocket("wss://api.tiingo.com/crypto");

  ws.onopen = () => {
    console.log("✅ Connected to Tiingo WebSocket");
    const subscribeMessage = {
      eventName: "subscribe",
      authorization: API_KEY,
      eventData: {
        thresholdLevel: 2,
        tickers: ["btcusd"],
      },
    };
    ws.send(JSON.stringify(subscribeMessage));
  };

let candleBuffer = []; // buffer to store ticks for the current minute
let currentCandleMinute = null;

ws.onmessage = (event) => {
  try {
    const response = JSON.parse(event.data);

    if (response.messageType === "A" && response.data?.length > 0) {
      if (response.data[0] === "Q") {
        const tick = response.data;

        const tickTime = new Date(tick[2]);
        const tickMinute = tickTime.getUTCFullYear() + "-" + tickTime.getUTCMonth() + "-" + tickTime.getUTCDate() + "-" + tickTime.getUTCHours() + "-" + tickTime.getUTCMinutes();

        if (currentCandleMinute === null) {
          currentCandleMinute = tickMinute;
        }

        if (tickMinute === currentCandleMinute) {
          // Collect tick data in buffer
          candleBuffer.push({
            time: tickTime,
            price: tick[5], // Trade price
          });
        } else {
          // Minute changed => finalize previous candle
          if (candleBuffer.length > 0) {
            const ohlc = generateCandle(candleBuffer);
            previousData.push(ohlc);

            if (previousData.length > 50) previousData.shift();

            // Broadcast to all clients
            clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(ohlc));
              }
            });
          }

          // Reset for new minute
          candleBuffer = [{
            time: tickTime,
            price: tick[5],
          }];
          currentCandleMinute = tickMinute;
        }
      }
    }
  } catch (err) {
    console.error("❌ WebSocket Parse Error:", err);
  }
};


  ws.onerror = (err) => console.error("❌ Tiingo WebSocket Error:", err);
  ws.onclose = () => {
    console.warn("⚠️ Tiingo WebSocket Disconnected! Reconnecting...");
    setTimeout(connectWebSocket, 5000);
  };
}

// Start Tiingo WebSocket connection
connectWebSocket();

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
function generateCandle(buffer) {
  const open = buffer[0].price;
  const close = buffer.at(-1).price;
  const high = Math.max(...buffer.map((d) => d.price));
  const low = Math.min(...buffer.map((d) => d.price));
  const timestamp = buffer[0].time.toISOString();

  return {
    x: timestamp,
    y: [
      parseFloat(open.toFixed(2)),
      parseFloat(high.toFixed(2)),
      parseFloat(low.toFixed(2)),
      parseFloat(close.toFixed(2)),
    ],
  };
}
