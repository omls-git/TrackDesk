import { Sequelize, DataTypes } from 'sequelize';
import { DB, USER, PASSWORD, HOST, dialect as _dialect, pool as _pool } from "../config/db.config.js";
import clientsModel from './clients.model.js';
import employeeModel from './employee.model.js';
import casesModel from './cases.model.js';

const sequelize = new Sequelize(DB, USER, PASSWORD,  {
  host: HOST,
  dialect: _dialect,
  pool: _pool
});

const dB = {};

dB.Sequelize = Sequelize;
dB.sequelize = sequelize;

dB.clients = clientsModel(sequelize, DataTypes);
dB.employeeTracker = employeeModel(sequelize, DataTypes);
dB.cases = casesModel(sequelize, DataTypes);


export default dB;
