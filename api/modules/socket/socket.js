module.exports = (broker, wss, db) => {
  const options = { qos: 0, retain: false };

  wss.on("connection", function connection(ws) {
    ws.on("error", console.error);
    
    ws.on("message", function message(r) {
      const e = JSON.parse(r).event;
      const response = JSON.parse(r).data;

      switch (e) {
        case "get/valves/request":
          getValvesData(ws);
          break;
        case "set/valve/time/request":
          broker.publish(
            "vk" + response.name,
            response.time,
            options,
            errorHandler
          );
          break;
        case "get/meters/data/request":
          getMetersData(ws);
          break;
        case "set/periods/number":
          broker.publish("k.p", response, options, errorHandler);
          break;
        case "get/periods/request":
          getPeriodsData(ws);
          break;
        case "set/period/request":
          broker.publish(
            "p" + response.name,
            response.value.replace(":", ""),
            options,
            errorHandler
          );
          break;
        case "get/pamps/request":
          getPamps(ws);
          break;
        case "set/pamp/request":
          let data = "";
          switch (response.name) {
            case "1":
              response.value === "on" ? (data = "b11") : (data = "b22");
              break;
            case "2":
              response.value === "on" ? (data = "b31") : (data = "b42");
              break;
            case "3":
              response.value === "on" ? (data = "b51") : (data = "b52");
              break;
          }
          broker.publish("nasos" + response.name, data, options, errorHandler);
          break;
        case "set/valve/status/request":
          let valveData = "";
          switch (response.name) {
            case "1":
              response.value === "on"
                ? (valveData = "k11")
                : (valveData = "k22");
              break;
            case "2":
              response.value === "on"
                ? (valveData = "k31")
                : (valveData = "k42");
              break;
            case "3":
              response.value === "on"
                ? (valveData = "k51")
                : (valveData = "k62");
              break;
            case "4":
              response.value === "on"
                ? (valveData = "k71")
                : (valveData = "k82");
              break;
          }
          broker.publish(
            "valve" + response.name,
            valveData,
            options,
            errorHandler
          );
          break;
        case "get/avtomat/request":
          getAvtomat(ws);
          break;
        case "set/avtomat/status/request":
          broker.publish("aru", response.value, options, errorHandler);
          break;
      }
    });
  });

  const params = { sort: { _id: -1 }, projection: { _id: 0 } };

  const getMetersData = async (ws) => {
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
        name: "Температура почвы",
      },
      {
        ...(await at.findOne({}, params)),
        name: "Температура воздуха",
      },
      {
        ...(await ah.findOne({}, params)),
        name: "Влажность воздуха",
      },
      {
        ...(await wf.findOne({ name: "4" }, params)),
        name: "Расход воды клапан 4",
      },
      {
        ...(await wf.findOne({ name: "3" }, params)),
        name: "Расход воды клапан 3",
      },
      {
        ...(await wf.findOne({ name: "2" }, params)),
        name: "Расход воды клапан 2",
      },
      {
        ...(await wf.findOne({ name: "1" }, params)),
        name: "Расход воды клапан 1",
      },
      {
        ...(await pp.findOne({}, params)),
        name: "Давление после насосов",
      },
      {
        ...(await fp.findOne({}, params)),
        name: "Давление после фильтров",
      },
      {
        ...(await ec.findOne({}, params)),
        name: "EC",
      },
      {
        ...(await ph.findOne({}, params)),
        name: "PH",
      },
      {
        ...(await h.findOne({ name: "1" }, params)),
        name: "Влажность почвы 1",
      },
      {
        ...(await h.findOne({ name: "2" }, params)),
        name: "Влажность почвы 2",
      },
      {
        ...(await h.findOne({ name: "3" }, params)),
        name: "Влажность почвы 3",
      },
      {
        ...(await h.findOne({ name: "4" }, params)),
        name: "Влажность почвы 4",
      },
      {
        ...(await h.findOne({ name: "5" }, params)),
        name: "Влажность почвы 5",
      },
    ];

    ws.send(JSON.stringify({ event: "get/meters/data/response", data }));
  };

  const getValvesData = async (ws) => {
    const data = await db.collection("valves").find().toArray();
    const valves = data.map(({ name, time, status }) => ({
      name,
      time,
      status,
    }));

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

  const getAvtomat = async (ws) => {
    const data = await db.collection("avtomat").findOne();
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

  function errorHandler(error) {
    if (error) {
      console.error("brocker publish fail", error);
    }
  }
};
