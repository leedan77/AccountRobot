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

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _config.initChatMenu)();
var app = (0, _express2.default)();

if (process.env.NODE_ENV !== 'test') {
  app.use((0, _morgan2.default)('dev'));
}
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());

app.get('/', function (req, res) {
  res.send('Hello world, I am a chat bot');
});

// for Facebook verification
app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'i_am_a_token_hehe') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong token');
});

app.post('/webhook/', function (req, res) {
  //sendWelcomeMessage();
  var messaging_events = req.body.entry[0].messaging;
  for (var i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i];
    var sender = event.sender.id;
    if (event.message && event.message.text) {
      var text = event.message.text;
      if (text === 'Generic') {
        sendGenericMessage(sender);
        continue;
      }
      sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200));
    }
    if (event.postback) {
      var _text = JSON.stringify(event.postback);
      sendTextMessage(sender, "Postback received: " + _text.substring(0, 200), token);
      continue;
    }
  }
  res.sendStatus(200);
});

// API PART
var token = process.env.FB_PAGE_ACCESS_TOKEN;

/*
function sendWelcomeMessage() {
  let greetData = {
    "setting_type": "greeting",
    "greeting": {
      "text": "我是幫你記帳的小幫手喔>__<"
    }
  };
  request({
    url: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: {access_token: token},
    method: 'POST',
    json: greetData,
  }, function(error, response, body){
    if(error) console.error(error);
    else {
      console.log(body);
    }
  });

}
*/

function sendTextMessage(sender, text) {
  var messageData = { text: text };
  (0, _request2.default)({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: token },
    method: 'POST',
    json: {
      recipient: { id: sender },
      message: messageData
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

function sendGenericMessage(sender) {
  var messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "First card",
          "subtitle": "Element #1 of an hscroll",
          "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
          "buttons": [{
            "type": "web_url",
            "url": "https://www.messenger.com",
            "title": "web url"
          }, {
            "type": "postback",
            "title": "Postback",
            "payload": "Payload for first element in a generic bubble"
          }]
        }, {
          "title": "Second card",
          "subtitle": "Element #2 of an hscroll",
          "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
          "buttons": [{
            "type": "postback",
            "title": "Postback",
            "payload": "Payload for second element in a generic bubble"
          }]
        }]
      }
    }
  };
  (0, _request2.default)({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: token },
    method: 'POST',
    json: {
      recipient: { id: sender },
      message: messageData
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

exports.default = app;