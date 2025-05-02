const topics = require("./topics");

module.exports = (client, wss, db) => {
  client.on("connect", () => {
    if (client.connected === true) {
      console.log("2. Подключение к broker установлено");
      client.subscribe(topics, { qos: 1 }, (err) => {
        if (err) {
          console.error("Error subscribing to topics:", err);
        } else {
          console.log("   - Mqtt клиент подписался на топики");
        }
      });
    }
  });

  client.on("message", (topic, message) => {
    switch (topic) {
      case "humidity1":
      case "humidity2":
      case "humidity3":
      case "humidity4":
      case "humidity5":
        handleHumidity(topic, message);
        break;
      case "vk1o":
      case "vk2o":
      case "vk3o":
      case "vk4o":
        handleValveTime(topic, message);
        break;
      case "k.p":
        handlePeriodCount(topic, message);
        break;
      case "p1o":
      case "p2o":
      case "p3o":
      case "p4o":
      case "p5o":
        handlePeriod(topic, message);
        break;
      case "nasos1o":
      case "nasos2o":
      case "nasos3o":
        handlePamp(topic, message);
        break;
      case "valve1o":
      case "valve2o":
      case "valve3o":
      case "valve4o":
        handleValveStatus(topic, message);
        break;
      case "aruo":
        handleAvtomatStatus(topic, message);
        break;
      case "t.soil":
        handleOther("m.soil-temperature", message);
        break;
      case "t.air":
        handleOther("m.air-temperature", message);
        break;
      case "h.air":
        handleOther("m.air-humidity", message);
        break;
      case "counter1":
      case "counter2":
      case "counter3":
      case "counter4":
        waterFlowHandler(topic, message);
        break;
      case "dnas":
        handleOther("m.pumps-output-pressure", message);
        break;
      case "dfil":
        handleOther("m.filters-output-pressure", message);
        break;
      case "ec":
        handleOther("m.ec", message);
        break;
      case "ph":
        handleOther("m.ph", message);
        break;
    }
  });

  function handleOther(collection, message) {
    const value = message.toString();
    db.collection(collection).insertOne({ value });
  }

  function waterFlowHandler(topic, message) {
    const name = topic.slice(-1);
    const value = message.toString();

    db.collection("m.water-flow").insertOne({ name, value });
  }

  function handleHumidity(topic, message) {
    const name = topic.slice(8, 9);
    const value = message.toString();
    db.collection("m.humidity").insertOne({ name, value });
  }

  function handleValveTime(topic, message) {
    const name = topic.slice(2, 3);
    const time = message.toString();

    db.collection("valves").updateOne({ name }, { $set: { time } });
    send({ event: "valve/time", data: { name, time } });
  }

  function handlePeriodCount(topic, message) {
    const value = message.toString();

    db.collection("periods").updateOne(
      { name: "periods number" },
      { $set: { value: value } }
    );

    send({ event: "periods/number", data: value });
  }

  function handlePeriod(topic, message) {
    const name = topic.slice(1, 2);
    const value = message.toString();

    db.collection("periods").updateOne(
      { name: "period " + name },
      { $set: { value: value } }
    );

    send({ event: "set/period/response", data: { name, value } });
  }

  function handlePamp(topic, message) {
    const name = topic.slice(-2, -1);
    const value = message.toString();

    db.collection("pamps").updateOne({ name }, { $set: { value: value } });

    send({ event: "set/pamps/response", data: { name, value } });
    console.log(1);
  }

  function handleValveStatus(topic, message) {
    const name = topic.slice(-2, -1);
    const status = message.toString();

    db.collection("valves").updateOne({ name }, { $set: { status } });

    send({
      event: "set/valve/status/response",
      data: { name, status },
    });
  }

  function handleAvtomatStatus(topic, message) {
    const status = message.toString();

    db.collection("avtomat").updateOne({ name: "1" }, { $set: { status } });

    send({
      event: "set/avtomat/status/response",
      data: { name: "1", status },
    });
  }

  client.on("error", (error) => {
    console.error("connection failed", error);
  });

  function send(obj) {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(obj));
      }
    });
  }
};
