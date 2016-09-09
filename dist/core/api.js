'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BASE_URL = 'https://graph.facebook.com/v2.6/me/';

function post(type, data) {
  return (0, _isomorphicFetch2.default)('' + BASE_URL + type, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(Object.assign(data, { access_token: _config.token }))
  }).then(function (res) {
    return res.json();
  });
}

exports.default = { post: post };