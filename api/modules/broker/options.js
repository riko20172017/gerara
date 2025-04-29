module.exports = {
  url: `mqtt://${process.env.BROKER_IP}:1883`,
  options: {
    clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
    clean: true,
    connectTimeout: 4000,
    username: "",
    password: "",
    reconnectPeriod: 1000,
  },
};