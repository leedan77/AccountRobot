'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _config = require('./config');

var _routes = require('../routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('Bot:log');
var error = (0, _debug2.default)('Bot:error');

(0, _config.initNewThreadBtn)().then(function (res) {
  log(res);
}).catch(function (err) {
  error(err);
});

(0, _config.initChatMenu)();

var app = (0, _express2.default)();

if (process.env.NODE_ENV !== 'test') {
  app.use((0, _morgan2.default)('dev'));
}
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());

app.use(_routes2.default);

exports.default = app;