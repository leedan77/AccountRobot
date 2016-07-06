'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initChatMenu = initChatMenu;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var token = process.env.FB_PAGE_ACCESS_TOKEN;

function initChatMenu() {
  _axios2.default.post('https://graph.facebook.com/v2.6/me/thread_settings', {
    access_token: token,
    setting_type: "call_to_actions",
    thread_state: "existing_thread",
    "call_to_actions": [{
      "type": "postback",
      "title": "Help",
      "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_HELP"
    }, {
      "type": "postback",
      "title": "新增新的紀錄",
      "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_START_ORDER"
    }, {
      "type": "web_url",
      "title": "聯絡我",
      "url": "https://github.com/leedan77"
    }]
  }, {
    header: {
      'Content-type': 'application/json'
    }
  }).then(function (response) {
    console.log(response.data);
  }).catch(function (error) {
    console.log(error);
  });
}