const BROKER_DOMEN =
  process.env.ENVIRONMENT === "remote" ? "broker" : "185.221.155.147";
module.exports = {
  url: `mqtt://${BROKER_DOMEN}:1883`,
  options: {
    clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
    clean: true,
    connectTimeout: 4000,
    username: "",
    password: "",
    reconnectPeriod: 1000,
  },
};
