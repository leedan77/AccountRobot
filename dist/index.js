'use strict';

var _config = require('./config');

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();


(0, _config.initChatMenu)();

app.set('port', process.env.PORT || 9000);

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Process application/json
app.use(bodyParser.json());

// Index route
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
  request({
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
  request({
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

// Spin up the server
app.listen(app.get('port'), function () {
  console.log('running on port', app.get('port'));
});