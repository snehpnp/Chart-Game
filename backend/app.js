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

wss.on("connection", (ws) => {
  console.log("📡 Frontend WebSocket Connected");
  clients.add(ws);

  // Send previous data when frontend connects
  if (previousData.length > 0) {
    ws.send(JSON.stringify(previousData));
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
      eventData: { tickers: ["btcusd"] },
    };
    ws.send(JSON.stringify(subscribeMessage));
  };

  ws.onmessage = (event) => {
    try {
      const response = JSON.parse(event.data);
      // console.log("📊 Received Data:", response);

      if (response.messageType === "A" && response.data?.length > 0) {
        const newData = response.data // Only take the latest data
        previousData.push(newData); // Store new data in previousData

        // Limit previous data array to last 50 entries
        // if (previousData.length > 50) {
        //   previousData.shift(); // Remove oldest data
        // }
        

        // Send updated previous + new data to all connected frontend clients
        clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(previousData));
          }
        });
      }
    } catch (error) {
      console.error("❌ Error parsing WebSocket data:", error);
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
