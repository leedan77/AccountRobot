'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectDb = connectDb;
exports.disconnectDb = disconnectDb;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function connectDb() {
  return new Promise(function (resolve, reject) {
    _mongoose2.default.connect(_config.dbUrl, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

function disconnectDb() {
  return new Promise(function (resolve, reject) {
    _mongoose2.default.disconnect(function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};