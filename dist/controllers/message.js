'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendTextMessage = sendTextMessage;
exports.sendGenericMessage = sendGenericMessage;

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _config = require('../core/config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BASE_URL = 'https://graph.facebook.com/v2.6/me/messages';
var queryString = _url2.default.format({
  query: { access_token: _config.token }
});

function sendTextMessage(sender, text) {
  var messageData = { text: text };
  return (0, _isomorphicFetch2.default)('' + BASE_URL + queryString, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      recipient: {
        id: sender
      },
      message: messageData
    })
  }).then(function (res) {
    return res.json();
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
  return (0, _isomorphicFetch2.default)('' + BASE_URL + queryString, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      recipient: {
        id: sender
      },
      message: messageData
    })
  }).then(function (res) {
    return res.json();
  });
}