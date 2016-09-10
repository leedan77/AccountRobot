'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendButtonMessage = undefined;

var sendButtonMessage = exports.sendButtonMessage = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(sender, text, buttons) {
    var messageData;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            messageData = {
              message: {
                attachment: {
                  type: "template",
                  payload: {
                    template_type: "button",
                    text: text,
                    buttons: buttons
                  }
                }
              }
            };

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function sendButtonMessage(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.sendTextMessage = sendTextMessage;
exports.sendGenericMessage = sendGenericMessage;

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _config = require('../core/config');

var _api = require('../core/api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var BASE_URL = 'https://graph.facebook.com/v2.6/me/messages';

function sendTextMessage(sender, text) {
  var messageData = {
    text: text,
    metadata: "TEST_TEST"
  };
  return (0, _isomorphicFetch2.default)('' + BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      access_token: _config.token,
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
        }]
      }
    }
  };
  return (0, _isomorphicFetch2.default)('' + BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      access_token: _config.token,
      recipient: {
        id: sender
      },
      message: messageData
    })
  }).then(function (res) {
    return res.json();
  });
}