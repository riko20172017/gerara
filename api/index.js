const { WebSocketServer } = require("ws");
const { createServer } = require("https");
const { readFileSync } = require("fs");
const express = require("express"); // подключаем фреймворк Express (модуль)
const MongoClient = require("mongodb").MongoClient;
const mqtt = require("mqtt");
const setupMqttClient = require("./modules/broker/broker.js");
const mqttInits = require("./modules/broker/options.js");
const setupWebSocket = require("./modules/socket/socket.js");

const server = createServer({
  cert: readFileSync('/etc/letsencrypt/live/gerara.ru/cert.pem'),
  key: readFileSync('/etc/letsencrypt/live/gerara.ru/privkey.pem')
});

async function setup() {
  try {
    const mongo = new MongoClient(`mongodb://mongo:27017/`);
    const connection = await mongo.connect();
    console.log("1. Подключение к mongo установлено");

    const db = connection.db("gerara");
    const wss = new WebSocketServer({ server });
    const mqttClient = mqtt.connect(mqttInits.url, mqttInits.options);

    setupMqttClient(mqttClient, wss, db); // инициализируем брокер mqtt
    setupWebSocket(mqttClient, wss, db); // инициализируем WebSocket
    server.listen(7000)
  } catch (err) {
    console.error("Ошибка подключения к MongoDB:", err);
  }
}

setup();

const app = express(); // создаем экземпляр приложения
const router = express.Router(); // создаем экземпляр роутера

const path = __dirname; // записываем путь до рабочего каталога
const port = 8000; // записываем порт сервера

// выводим в консоль HTTP METHOD при каждом запросе
router.use(function (req, res, next) {
  console.log("/" + req.method);
  next();
});

// отвечаем на запрос главной страницы файлом index.html
router.get("/", function (req, res) {
  res.sendFile(path + "/index.html");
});

// подключаем роутер к приложению
app.use("/", router);

// начинаем прослушивать порт 8080, тем самым запуская http-сервер
app.listen(port, function () {
  console.log("Listening on port 8000");
});
