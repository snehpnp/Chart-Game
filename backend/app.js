const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const data = require("./data"); // Assuming you have a data.json file with your initial data

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 6767;

// Connected clients
let clients = new Set();
// Store last 100 candles
let previousData = [];
// Batch buffer to send every 10 candles
let batchBuffer = [];

wss.on("connection", (ws) => {
  console.log("📡 Frontend WebSocket Connected");
  clients.add(ws);

  // Send previous 100 candles when frontend connects
  if (previousData.length > 0) {
    ws.send(JSON.stringify(previousData));
  }

  ws.on("close", () => {
    console.log("🔌 Frontend WebSocket Disconnected");
    clients.delete(ws);
  });
});

// 🔁 Generate random candles every second
let lastClose = 100;

setInterval(() => {
  const open = lastClose;
  const close = open + (Math.random() * 4 - 2);
  const high = Math.max(open, close) + Math.random();
  const low = Math.min(open, close) - Math.random();

  const newCandle = {
    time: Math.floor(Date.now() / 1000),
    open: Number(open.toFixed(2)),
    high: Number(high.toFixed(2)),
    low: Number(low.toFixed(2)),
    close: Number(close.toFixed(2)),
  };

  lastClose = newCandle.close;

  previousData.push(newCandle);
  if (previousData.length > 100) {
    previousData.shift(); // Keep last 100
  }

  batchBuffer.push(newCandle);

  // 📤 Send batch of 10 candles every 10 seconds
  // if (batchBuffer.length === 10) {
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(batchBuffer));
      }
    });

  // }

}, 1000);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
