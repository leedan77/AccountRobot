'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = start;
exports.stop = stop;

require('babel-polyfill');

var _http = require('http');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _app = require('./core/app');

var _app2 = _interopRequireDefault(_app);

var _db = require('./core/db');

var _config = require('./core/config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('http:log');
var error = (0, _debug2.default)('http:error');

var server = (0, _http.createServer)(_app2.default);

function start() {
  return (0, _db.connectDb)().then(function () {
    return new Promise(function (resolve, reject) {
      server.listen(_config.port);
      server.on('listening', function () {
        log('listening on port: ' + _config.port);
        resolve();
      });
      server.on('error', function (err) {
        reject(err);
      });
    });
  });
}

function stop() {
  (0, _db.disconnectDb)().then(function () {
    server.close();
  });
}

if (require.main === module) {
  start().catch(function (err) {
    error(err);
    stop();
  });
}