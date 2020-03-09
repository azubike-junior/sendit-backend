"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _config = require("../configs/config");

var _dotenv = _interopRequireDefault(require("dotenv"));

_dotenv.default.config();

const prod_config = _config.dbConfig.production.connectionString;
const dev_config = _config.dbConfig.development.connectionString;
const env = 'development' || 'production';
const configPath = env === 'production' ? prod_config : dev_config;
let sequelize;
sequelize = env === 'development' ? new _sequelize.default(configPath, {
  dialect: 'postgres',
  host: 'localhost',
  logging: false
}) : new _sequelize.default(configPath, {
  dialect: 'postgres'
});
const db = {};

_fs.default.readdirSync(__dirname).filter(file => {
  return file.indexOf('.') !== 0 && file !== 'index.js';
}).forEach(file => {
  const model = sequelize.import(_path.default.join(__dirname, file));
  db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = _sequelize.default;
var _default = db;
exports.default = _default;