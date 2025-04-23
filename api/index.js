const { WebSocketServer } = require("ws");
const express = require("express"); // подключаем фреймворк Express (модуль)
const MongoClient = require("mongodb").MongoClient;
const mqtt = require("mqtt");

let db;
const mongoc = new MongoClient(`mongodb://mongo:27017/`);
mongoc.connect().then(mc => {
  console.log("Подключение к mongo установлено");
  db = mc.db("gerara");

});


// const http = require("http"); 
// const uuidv4 = require("uuid").v4;

const wss = new WebSocketServer({ port: 7000 });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  let interval = setInterval(() => getSelPos(ws), 10000);
});

const getSelPos = async (ws) => {
  // name value
  const h1 = await db.collection("humidity1").find().sort({ _id: -1 }).limit(1).toArray()
  const h2 = await db.collection("humidity2").find().sort({ _id: -1 }).limit(1).toArray()
  const h3 = await db.collection("humidity3").find().sort({ _id: -1 }).limit(1).toArray()
  const h4 = await db.collection("humidity4").find().sort({ _id: -1 }).limit(1).toArray()
  const h5 = await db.collection("humidity5").find().sort({ _id: -1 }).limit(1).toArray()

  ws.send(JSON.stringify([].concat(h1, h2, h3, h4, h5)))
}

const brokerIp = process.env.BROKER_IP;
const protocol = "mqtt";
const portMqtt = "1883";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `${protocol}://${brokerIp}:${portMqtt}`;

const broker = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: "",
  password: "",
  reconnectPeriod: 1000,
});

broker.on("connect", () => {
  if (broker.connected === true) {
    console.log(`brocker: connected`);
    broker.subscribe("humidity1");
    broker.subscribe("humidity2");
    broker.subscribe("humidity3");
    broker.subscribe("humidity4");
    broker.subscribe("humidity5");
  }
});

broker.on('message', (topic, message) => {
  if (topic == "humidity1") {
    db.collection("humidity1").insertOne({ name: "humidity1", value: message.toString() });
  }
  if (topic == "humidity2") {
    db.collection("humidity2").insertOne({ name: "humidity2", value: message.toString() });
  }
  if (topic == "humidity3") {
    db.collection("humidity3").insertOne({ name: "humidity3", value: message.toString() });
  }
  if (topic == "humidity4") {
    db.collection("humidity4").insertOne({ name: "humidity4", value: message.toString() });
  }
  if (topic == "humidity5") {
    db.collection("humidity5").insertOne({ name: "humidity5", value: message.toString() });
  }
});

broker.on("error", (error) => {
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

  broker.publish("test", req.query.action, { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error);
    }
  });
  res.send("Get an existing workout");
});

router.get("/valve/set/timer", (req, res) => {
  console.log(req.query.action);

  broker.publish("test", req.query.action, { qos: 0, retain: false }, (error) => {
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
