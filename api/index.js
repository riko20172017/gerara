const express = require("express"); // подключаем фреймворк Express (модуль)
const mqtt = require("mqtt");

const protocol = "mqtt";
const portMqtt = "1883";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `${protocol}://broker:${portMqtt}`;

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: "",
  password: "",
  reconnectPeriod: 1000,
});

client.on("connect", () => {
  console.log("connected");
});
client.on("error", (error) => {
  console.error("connection failed", error);
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
router.get("/onoff", (req, res) => {
  console.log(req.query.action);

  client.publish("test", req.query.action, { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error);
    }
  });
  res.send("Get an existing workout");
});

// подключаем роутер к приложению
app.use("/", router);

// начинаем прослушивать порт 8080, тем самым запуская http-сервер
app.listen(port, function () {
  console.log("Listening on port 8000");
});
