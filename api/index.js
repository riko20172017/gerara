const { WebSocketServer } = require("ws");
const express = require("express"); // подключаем фреймворк Express (модуль)
const MongoClient = require("mongodb").MongoClient;
const mqtt = require("mqtt");

let db;
let broker;
const mongoc = new MongoClient(`mongodb://mongo:27017/`);
mongoc.connect().then((mc) => {
  console.log("Подключение к mongo установлено");
  db = mc.db("gerara");
});

// const http = require("http");
// const uuidv4 = require("uuid").v4;

const wss = new WebSocketServer({ port: 7000 });

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(r) {
    res = JSON.parse(r);

    if (res.event == "get/valves/request") {
      setImmediate(() => getValvesData(ws));
    }

    if (res.event == "set/valve/time/request") {
      broker.publish(
        "vk" + res.data.name,
        res.data.time,
        { qos: 0, retain: false },
        (error) => {
          if (error) {
            console.error("brocker publish fail", error);
          }
        }
      );
    }

    if (res.event == "get/meters/data/request") {
      getMetersData(ws);
      let interval = setInterval(() => getMetersData(ws), 10000);
    }

    if (res.event == "set/periods/number") {
      broker.publish("k.p", res.data, { qos: 0, retain: false }, (error) => {
        if (error) {
          console.error("brocker publish fail", error);
        }
      });
    }

    if (res.event == "get/periods/request") {
      getPeriodsData(ws);
      setImmediate(() => getPeriodsData(ws));
    }

    if (res.event == "set/period/request") {
      broker.publish(
        "p" + res.data.name,
        res.data.value.replace(":", ""),
        { qos: 0, retain: false },
        (error) => {
          if (error) {
            console.error("brocker publish fail", error);
          }
        }
      );
    }

    if (res.event == "get/pamps/request") {
      setImmediate(() => getPamps(ws));
    }

    if (res.event == "set/pamp/request") {
      broker.publish(
        "nasos" + res.data.name,
        res.data.value,
        { qos: 0, retain: false },
        (error) => {
          if (error) {
            console.error("brocker publish fail", error);
          }
        }
      );
    }

    if (res.event == "set/valve/status/request") {
      broker.publish(
        "valve" + res.data.name,
        res.data.value,
        { qos: 0, retain: false },
        (error) => {
          if (error) {
            console.error("brocker publish fail", error);
          }
        }
      );
    }
  });
});

const getMetersData = async (ws) => {
  // name value
  const h1 = await db
    .collection("humidity1")
    .find()
    .sort({ _id: -1 })
    .limit(1)
    .toArray();
  const h2 = await db
    .collection("humidity2")
    .find()
    .sort({ _id: -1 })
    .limit(1)
    .toArray();
  const h3 = await db
    .collection("humidity3")
    .find()
    .sort({ _id: -1 })
    .limit(1)
    .toArray();
  const h4 = await db
    .collection("humidity4")
    .find()
    .sort({ _id: -1 })
    .limit(1)
    .toArray();
  const h5 = await db
    .collection("humidity5")
    .find()
    .sort({ _id: -1 })
    .limit(1)
    .toArray();

  const data = [
    { name: 1, value: h1 ? parseInt(h1[0].value) : 0 },
    { name: 2, value: h2 ? parseInt(h2[0].value) : 0 },
    { name: 3, value: h3 ? parseInt(h3[0].value) : 0 },
    { name: 4, value: h4 ? parseInt(h4[0].value) : 0 },
    { name: 5, value: h4 ? parseInt(h4[0].value) : 0 },
  ];

  ws.send(JSON.stringify({ event: "get/meters/data/response", data }));
};

const getValvesData = async (ws) => {
  const data = await db.collection("valves").find().toArray();
  const valves = data.map(({ name, time, status }) => ({ name, time, status }));

  ws.send(JSON.stringify({ event: "get/valves/response", data: valves }));
};

const getPeriodsData = async (ws) => {
  let data = await db.collection("periods").find().toArray();
  data = {
    length: data.shift().value,
    periods: data.map(({ value }, i) => {
      return { name: `${i + 1}`, value };
    }),
  };

  ws.send(JSON.stringify({ event: "get/periods/response", data }));
};

const getPamps = async (ws) => {
  let data = await db.collection("pamps").find().toArray();
  data = data.map(({ name, value }) => ({ name, value }));

  ws.send(JSON.stringify({ event: "get/pamps/response", data }));
};

const brokerIp = process.env.BROKER_IP;
const protocol = "mqtt";
const portMqtt = "1883";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `${protocol}://${brokerIp}:${portMqtt}`;

broker = mqtt.connect(connectUrl, {
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
    broker.subscribe("vk1o");
    broker.subscribe("vk2o");
    broker.subscribe("vk3o");
    broker.subscribe("vk4o");
    broker.subscribe("k.p");
    broker.subscribe("p1o");
    broker.subscribe("p2o");
    broker.subscribe("p3o");
    broker.subscribe("p4o");
    broker.subscribe("p5o");
    broker.subscribe("nasos1o");
    broker.subscribe("nasos2o");
    broker.subscribe("nasos3o");
    broker.subscribe("valve1o");
    broker.subscribe("valve2o");
    broker.subscribe("valve3o");
    broker.subscribe("valve4o");
  }
});

broker.on("message", (topic, message) => {
  if (
    topic == "humidity1" ||
    topic == "humidity2" ||
    topic == "humidity3" ||
    topic == "humidity4" ||
    topic == "humidity5"
  ) {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        handleHumidity(client, topic, message);
      }
    });
  }

  if (
    topic == "vk1o" ||
    topic == "vk2o" ||
    topic == "vk3o" ||
    topic == "vk4o"
  ) {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        handleValveTime(client, topic, message);
      }
    });
  }

  if (topic == "k.p") {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        handlePeriodCount(client, topic, message);
      }
    });
  }

  if (
    topic == "p1o" ||
    topic == "p2o" ||
    topic == "p3o" ||
    topic == "p4o" ||
    topic == "p5o"
  ) {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        handlePeriod(client, topic, message);
      }
    });
  }

  if (topic == "nasos1o" || topic == "nasos2o" || topic == "nasos3o") {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        handlePamp(client, topic, message);
      }
    });
  }

  if (
    topic == "valve1o" ||
    topic == "valve2o" ||
    topic == "valve3o" ||
    topic == "valve4o"
  ) {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        handleValveStatus(client, topic, message);
      }
    });
  }
});

function handleHumidity(ws, topic, message) {
  const name = parseInt(topic.slice(8, 9));
  const value = parseInt(message.toString());

  db.collection(topic).insertOne({
    name: topic,
    value: message.toString(),
  });
}

function handleValveTime(ws, topic, message) {
  const name = topic.slice(2, 3);
  const time = message.toString();

  ws.send(JSON.stringify({ event: "valve/time", data: { name, time } }));
  db.collection("valves").updateOne({ name }, { $set: { time } });
}

function handlePeriodCount(ws, topic, message) {
  const value = message.toString();

  const log = db
    .collection("periods")
    .updateOne({ name: "periods number" }, { $set: { value: value } });

  ws.send(JSON.stringify({ event: "periods/number", data: value }));
}

function handlePeriod(ws, topic, message) {
  const name = topic.slice(1, 2);
  const value = message.toString();

  db.collection("periods").updateOne(
    { name: "period " + name },
    { $set: { value: value } }
  );

  ws.send(
    JSON.stringify({ event: "set/period/response", data: { name, value } })
  );
}

function handlePamp(ws, topic, message) {
  const name = topic.slice(-2, -1);
  const value = message.toString();

  db.collection("pamps").updateOne({ name }, { $set: { value: value } });

  ws.send(
    JSON.stringify({ event: "set/pamps/response", data: { name, value } })
  );
}

function handleValveStatus(ws, topic, message) {
  const name = topic.slice(-2, -1);
  const status = message.toString();

  db.collection("valves").updateOne({ name }, { $set: { status } });

  ws.send(
    JSON.stringify({ event: "set/valve/status/response", data: { name, status } })
  );
}

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

  broker.publish(
    "test",
    req.query.action,
    { qos: 0, retain: false },
    (error) => {
      if (error) {
        console.error(error);
      }
    }
  );
  res.send("Get an existing workout");
});

router.get("/valve/set/timer", (req, res) => {
  console.log(req.query.action);

  broker.publish(
    "test",
    req.query.action,
    { qos: 0, retain: false },
    (error) => {
      if (error) {
        console.error(error);
      }
    }
  );
  res.send("Get an existing workout");
});

// подключаем роутер к приложению
app.use("/", router);

// начинаем прослушивать порт 8080, тем самым запуская http-сервер
app.listen(port, function () {
  console.log("Listening on port 8000");
});
