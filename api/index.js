const fs = require('fs');
const https = require('https');
const express = require('express');
const { WebSocketServer } = require('ws');
const MongoClient = require("mongodb").MongoClient;
const mqtt = require("mqtt");

const setupMqttClient = require("./modules/broker/broker.js");
const mqttInits = require("./modules/broker/options.js");
const setupWebSocket = require("./modules/socket/socket.js");

const app = express();

const server = https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/gerara.ru/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/gerara.ru/fullchain.pem')
}, app);

// 🎯 WebSocket-сервер вручную
const wss = new WebSocketServer({ port: 7000 });

async function setup() {
  try {
    const mongo = new MongoClient(`mongodb://mongo:27017/`);
    const connection = await mongo.connect();
    const db = connection.db("gerara");

    const mqttClient = mqtt.connect(mqttInits.url, mqttInits.options);

    setupMqttClient(mqttClient, wss, db);
    setupWebSocket(mqttClient, wss, db);

    server.listen(8000, () => {
      console.log('✅ HTTPS сервер слушает порт 8000');
    });

  } catch (err) {
    console.error("Ошибка запуска:", err);
  }
}

setup();

// Express-маршруты по желанию
app.get("/", (req, res) => {
  res.send("WebSocket-сервер работает");
});
