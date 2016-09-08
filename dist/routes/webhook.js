'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _message = require('../controllers/message');

var router = new _express.Router();

router.get('/', function (req, res) {
  if (req.query['hub.verify_token'] === 'i_am_a_token_hehe') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong token');
});

router.post('/', function (req, res) {
  //sendWelcomeMessage();
  var messaging_events = req.body.entry[0].messaging;
  for (var i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i];
    var sender = event.sender.id;
    if (event.message && event.message.text) {
      var text = event.message.text;
      if (text === 'Generic') {
        (0, _message.sendGenericMessage)(sender);
        continue;
      }
      (0, _message.sendTextMessage)(sender, "Text received, echo: " + text.substring(0, 200));
    }
    if (event.postback) {
      var _text = JSON.stringify(event.postback);
      (0, _message.sendTextMessage)(sender, "Postback received: " + _text.substring(0, 200), token);
      continue;
    }
  }
  res.sendStatus(200);
});

exports.default = router;