const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require("../config/db.config");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD,  {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool
});

const dB = {};

dB.Sequelize = Sequelize;
dB.sequelize = sequelize;

dB.clients = require("./clients.model")(sequelize, DataTypes);
dB.employeeTracker = require("./employee.model")(sequelize, DataTypes);
dB.cases = require("./cases.model")(sequelize, DataTypes);

module.exports = dB;
