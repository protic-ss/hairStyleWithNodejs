module.exports = {
  HOST: "localhost",
  USER: "admin",
  PASSWORD: "root",
  DB: "node_sequilize_api",
  dialect: "mysql",

  pool: {
    max: 5,
    min: 0,
    acruire: 30000,
    idle: 10000,
  },
};
