'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadPhoto = uploadPhoto;

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BASE_URL = 'http://jazzlion.com:4000/image';

function uploadPhoto(url) {
  return (0, _isomorphicFetch2.default)('' + BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      photoUrl: url
    })
  }).then(function (res) {
    return res.json();
  });
}