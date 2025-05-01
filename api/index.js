const { WebSocketServer } = require("ws");
const express = require("express"); // подключаем фреймворк Express (модуль)
const MongoClient = require("mongodb").MongoClient;
const mqtt = require("mqtt");
const initBroker = require("./modules/broker/broker.js");
const mqttInits = require("./modules/broker/options.js");
const initWebSocket = require("./modules/socket/socket.js");

const mongo = new MongoClient(`mongodb://mongo:27017/`);
const wss = new WebSocketServer({ port: 7000 });
const broker = mqtt.connect(mqttInits.url, mqttInits.options);

mongo.connect().then((mc) => {
  console.log("Подключение к mongo установлено");
  db = mc.db("gerara"); 

  initBroker(broker, wss, db);
  initWebSocket(broker, wss, db);
});

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
