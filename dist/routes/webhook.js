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
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = req.body.entry[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var entry = _step.value;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = entry.messaging[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var event = _step2.value;

          var sender = event.sender.id;
          if (event.message && event.message.text) {
            var text = event.message.text;
            if (text === 'Generic') {
              (0, _message.sendGenericMessage)(sender).then(function (res) {
                console.log(res);
              });
              continue;
            }
            (0, _message.sendTextMessage)(sender, "Text received, echo: " + text.substring(0, 200)).then(function (res) {
              console.log(res);
            });
          }
          if (event.postback) {
            console.log(event.postback);
            var _text = JSON.stringify(event.postback);
            (0, _message.sendTextMessage)(sender, "Postback received: " + _text.substring(0, 200)).then(function (res) {
              console.log(res);
            });
            continue;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  res.sendStatus(200);
});

exports.default = router;