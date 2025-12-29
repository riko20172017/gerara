const { WebSocketServer } = require("ws");
const { createServer } = require("http");
const express = require("express"); // подключаем фреймворк Express (модуль)
const MongoClient = require("mongodb").MongoClient;
const mqtt = require("mqtt");

const setupMqttClient = require("./modules/broker/broker.js");
const mqttInits = require("./modules/broker/options.js");
const setupWebSocket = require("./modules/socket/socket.js");

const server = createServer({ noServer: true });

const MONGO_DOMEN =
  process.env.ENVIRONMENT ? "mongo" : "localhost";

console.log(process.env.ENVIRONMENT)

async function setup() {
  try {
    const mongo = new MongoClient(`mongodb://${MONGO_DOMEN}:27017/`);
    const connection = await mongo.connect();
    const db = connection.db("gerara");
    const wss = new WebSocketServer({ noServer: true });

    server.on("upgrade", (req, socket, head) => {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    });

    const mqttClient = mqtt.connect(mqttInits.url, mqttInits.options);

    setupMqttClient(mqttClient, wss, db); // инициализируем брокер mqtt
    setupWebSocket(mqttClient, wss, db) ; // инициализируем WebSocket
    server.listen(7000);
  } catch (err) {
    console.error("Ошибка подключения к MongoDB");
  }
}

setup();
