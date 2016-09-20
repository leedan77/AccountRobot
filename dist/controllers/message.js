'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendTextMessage = sendTextMessage;
exports.sendButtonMessage = sendButtonMessage;
exports.sendGenericMessage = sendGenericMessage;
exports.sendReceipt = sendReceipt;

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _config = require('../core/config');

var _api = require('../core/api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BASE_URL = 'https://graph.facebook.com/v2.6/me/messages';

function sendTextMessage(sender, text) {
  var messageData = {
    text: text,
    metadata: "TEST"
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

function sendButtonMessage(sender, text, buttons) {
  var messageData = {
    recipient: {
      id: sender
    },
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
  return _api2.default.post('messages', messageData);
}

function sendGenericMessage(sender, items) {
  var elements = items.map(function (item) {
    return {
      title: item.name,
      subtitle: '$' + item.price,
      buttons: [{
        type: "postback",
        title: "查看同種類的項目",
        payload: 'TYPE_' + item.type
      }]
    };
  });
  var messageData = {
    recipient: {
      id: sender
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: elements
        }
      }
    }
  };
  return _api2.default.post('messages', messageData);
}

function sendReceipt(sender, items) {
  var cost = 0;
  var elements = items.map(function (item) {
    cost += item.price;
    return {
      title: item.name,
      subtitle: item.type,
      price: item.price
    };
  });
  var messageData = {
    recipient: {
      id: sender
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "receipt",
          recipient_name: sender,
          order_number: "77",
          currency: "TWD",
          payment_method: "現金",
          elements: elements,
          summary: {
            total_cost: cost
          }
        }
      }
    }
  };
  return _api2.default.post('messages', messageData);
}