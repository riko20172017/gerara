module.exports = (broker, wss, db) => {
  const options = { qos: 0, retain: false };

  wss.on("connection", function connection(ws) {
    ws.on("error", console.error);

    ws.on("message", function message(response) {
      const parsed = JSON.parse(response);
      const { action, data } = parsed;

      switch (action) {
        case "get_valves":
          getValves(ws);
          break;
        case "set_valve":
          broker.publish("vk" + data.name, data.time, options, errorHandler);
          break;
        case "get_meters":
          getMeters(ws);
          break;
        case "get_meter":
          getMeter(ws, data);
          break;
        case "set_periods":
          broker.publish("k.p", data, options, errorHandler);
          break;
        case "get_periods":
          getPeriodsData(ws);
          break;
        case "set_period":
          broker.publish(
            "p" + data.name,
            data.value.replace(":", ""),
            options,
            errorHandler
          );
          break;
        case "get_pamps":
          getPamps(ws);
          break;
        case "set_pamp":
          let topic = "";
          switch (data.name) {
            case "1":
              data.value === "on" ? (topic = "b11") : (topic = "b22");
              break;
            case "2":
              data.value === "on" ? (topic = "b31") : (topic = "b42");
              break;
            case "3":
              data.value === "on" ? (topic = "b51") : (topic = "b62");
              break;
          }
          broker.publish("nasos" + data.name, topic, options, errorHandler);
          break;
        case "set_valve_status":
          let valveData = "";
          switch (data.name) {
            case "1":
              data.value === "on" ? (valveData = "k11") : (valveData = "k22");
              break;
            case "2":
              data.value === "on" ? (valveData = "k31") : (valveData = "k42");
              break;
            case "3":
              data.value === "on" ? (valveData = "k51") : (valveData = "k62");
              break;
            case "4":
              data.value === "on" ? (valveData = "k71") : (valveData = "k82");
              break;
          }
          broker.publish("valve" + data.name, valveData, options, errorHandler);
          break;
        case "get/avtomat/request":
          getAvtomat(ws);
          break;
        case "set_avtomat":
          broker.publish("aru", data.value, options, errorHandler);
          break;
      }
    });
  });

  const params = { sort: { _id: -1 }, projection: { _id: 0 } };

  const getMeters = async (ws) => {
    const h = db.collection("m.humidity");
    const st = db.collection("m.soil-temperature");
    const at = db.collection("m.air-temperature");
    const ah = db.collection("m.air-humidity");
    const wf = db.collection("m.water-flow");
    const pp = db.collection("m.pumps-output-pressure");
    const fp = db.collection("m.filters-output-pressure");
    const ec = db.collection("m.ec");
    const ph = db.collection("m.ph");

    const data = [
      {
        ...(await st.findOne({}, params)),
        title: "Температура почвы",
        type: st.collectionName,
        name: "",
      },
      {
        ...(await at.findOne({}, params)),
        title: "Температура воздуха",
        type: at.collectionName,
        name: "",
      },
      {
        ...(await ah.findOne({}, params)),
        title: "Влажность воздуха",
        type: ah.collectionName,
        name: "",
      },
      {
        ...(await wf.findOne({ name: "4" }, params)),
        title: "Расход воды клапан 4",
        type: wf.collectionName,
        name: "4",
      },
      {
        ...(await wf.findOne({ name: "3" }, params)),
        title: "Расход воды клапан 3",
        type: wf.collectionName,
        name: "3",
      },
      {
        ...(await wf.findOne({ name: "2" }, params)),
        title: "Расход воды клапан 2",
        type: wf.collectionName,
        name: "2",
      },
      {
        ...(await wf.findOne({ name: "1" }, params)),
        title: "Расход воды клапан 1",
        type: wf.collectionName,
        name: "1",
      },
      {
        ...(await pp.findOne({}, params)),
        title: "Давление после насосов",
        type: pp.collectionName,
        name: "",
      },
      {
        ...(await fp.findOne({}, params)),
        title: "Давление после фильтров",
        type: fp.collectionName,
        name: "",
      },
      {
        ...(await ec.findOne({}, params)),
        title: "EC",
        type: ec.collectionName,
        name: "",
      },
      {
        ...(await ph.findOne({}, params)),
        title: "PH",
        type: ph.collectionName,
        name: "",
      },
      {
        ...(await h.findOne({ name: "1" }, params)),
        title: "Влажность почвы 1",
        type: h.collectionName,
        name: "1",
      },
      {
        ...(await h.findOne({ name: "2" }, params)),
        title: "Влажность почвы 2",
        type: h.collectionName,
        name: "2",
      },
      {
        ...(await h.findOne({ name: "3" }, params)),
        title: "Влажность почвы 3",
        type: h.collectionName,
        name: "3",
      },
      {
        ...(await h.findOne({ name: "4" }, params)),
        title: "Влажность почвы 4",
        type: h.collectionName,
        name: "4",
      },
      {
        ...(await h.findOne({ name: "5" }, params)),
        title: "Влажность почвы 5",
        type: h.collectionName,
        name: "5",
      },
    ];

    ws.send(JSON.stringify({ event: "meters", data }));
  };

  const getMeter = async (ws, response) => {
    const collectionName = response.type;
    const collection = db.collection(collectionName);
    const name = response.name;
    let data = [];

    if (name !== "-1") {
      data = await collection
        .find({ name: name })
        .sort({ _id: -1 }) // ← сортируем от новых к старым
        .limit(50) // ← последние 10
        .toArray();
    } else {
      data = await collection.find().sort({ _id: -1 }).limit(50).toArray();
    }

    const result = data.map((doc) => ({
      value: doc.value,
      createdAt: doc._id.getTimestamp().toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }), // Date объект
      createdAtISO: doc._id.getTimestamp().toISOString(), // Строка в ISO формате
      createdAtLocale: doc._id.getTimestamp().toLocaleString(), // Локализованная строка
    }));

    const values = result.map((item) => item.value);
    const times = result.map((item) => item.createdAt);

    ws.send(
      JSON.stringify({
        event: "meter",
        data: { values, times },
      })
    );
  };

  const getValves = async (ws) => {
    const valves = await _getValves();

    ws.send(JSON.stringify({ event: "valves", data: valves }));
  };

  const _getValves = async (ws) => {
    const data = await db.collection("valves").find().toArray();
    return data.map(({ name, time, status }) => ({
      name,
      time,
      status,
    }));
  };

  const getPeriodsData = async (ws) => {
    let data = await db.collection("periods").find().toArray();
    data = {
      length: data.shift().value,
      periods: data.map(({ value }, i) => {
        return { name: `${i + 1}`, value };
      }),
    };

    ws.send(JSON.stringify({ event: "periods", data }));
  };

  const getPamps = async (ws) => {
    const pamps = await _getPamps();
    const valves = await _getValves();
    const avtomat = await _getAvtomat();

    ws.send(
      JSON.stringify({
        event: "pamps",
        data: { pamps, valves, avtomat },
      })
    );
  };

  const _getPamps = async (ws) => {
    const pamps = await db.collection("pamps").find().toArray();
    return pamps.map(({ name, value }) => ({ name, value }));
  };

  const getAvtomat = async (ws) => {
    const avtomat = await db.collection("avtomat").findOne();

    ws.send(
      JSON.stringify({
        event: "get/avtomat/response",
        data: {
          name: data.name,
          status: data.status,
        },
      })
    );
  };

  const _getAvtomat = async (ws) => {
    const avtomat = await db.collection("avtomat").findOne();
    return { name: avtomat.name, status: avtomat.status };
  };

  function errorHandler(error) {
    if (error) {
      console.error("brocker publish fail", error);
    }
  }
};
