'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _webhook = require('./webhook');

var _webhook2 = _interopRequireDefault(_webhook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _express.Router();

router.get('/', function (req, res) {
  res.json({
    message: "I am a Facebook robot"
  });
});

router.use('/webhook', _webhook2.default);

exports.default = router;