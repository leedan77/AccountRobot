'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _message = require('../controllers/message');

var _item = require('../controllers/item');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var _marked = [newItemFlow].map(regeneratorRuntime.mark);

var router = new _express.Router();

router.get('/', function (req, res) {
  if (req.query['hub.verify_token'] === 'i_am_a_token_hehe') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong token');
});

var newItemFlag = false;

function newItemFlow() {
  return regeneratorRuntime.wrap(function newItemFlow$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

router.post('/', function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res, next) {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, entry, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, event, sender, payload, text, arrStr, name, price, type, buttons, result;

    return regeneratorRuntime.wrap(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 4;
            _iterator = req.body.entry[Symbol.iterator]();

          case 6:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context2.next = 58;
              break;
            }

            entry = _step.value;
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context2.prev = 11;
            _iterator2 = entry.messaging[Symbol.iterator]();

          case 13:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context2.next = 41;
              break;
            }

            event = _step2.value;
            sender = event.sender.id;

            console.log(JSON.stringify(event.message));

            if (!event.postback) {
              _context2.next = 21;
              break;
            }

            payload = event.postback.payload;

            if (payload === 'NEW_ITEM') {
              (0, _message.sendTextMessage)(sender, "請依序輸入: 商品名稱 價錢 類型");
              newItemFlag = true;
            } else if (payload === 'CANCEL_ITEM') {
              (0, _message.sendTextMessage)(sender, "已取消新增項目");
              newItemFlag = false;
            }
            return _context2.abrupt('continue', 38);

          case 21:
            if (!(event.message && event.message.text)) {
              _context2.next = 38;
              break;
            }

            text = event.message.text;

            if (!newItemFlag) {
              _context2.next = 38;
              break;
            }

            arrStr = text.split(' ');

            if (!(arrStr.length == 3)) {
              _context2.next = 34;
              break;
            }

            name = arrStr[0];
            price = Number(arrStr[1]);
            type = arrStr[2];
            _context2.next = 31;
            return (0, _item.createNewItem)(sender, name, type, price);

          case 31:
            (0, _message.sendTextMessage)(sender, '已儲存 新的項目: ' + name + ', 價錢: ' + price + ', 種類: ' + type);
            _context2.next = 38;
            break;

          case 34:
            buttons = [{
              type: "postback",
              title: "取消新增項目",
              payload: "CANCEL_ITEM"
            }];
            _context2.next = 37;
            return (0, _message.sendButtonMessage)(sender, "錯誤的格式, 請依序輸入: 商品名稱 價錢 類型", buttons);

          case 37:
            result = _context2.sent;

          case 38:
            _iteratorNormalCompletion2 = true;
            _context2.next = 13;
            break;

          case 41:
            _context2.next = 47;
            break;

          case 43:
            _context2.prev = 43;
            _context2.t0 = _context2['catch'](11);
            _didIteratorError2 = true;
            _iteratorError2 = _context2.t0;

          case 47:
            _context2.prev = 47;
            _context2.prev = 48;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 50:
            _context2.prev = 50;

            if (!_didIteratorError2) {
              _context2.next = 53;
              break;
            }

            throw _iteratorError2;

          case 53:
            return _context2.finish(50);

          case 54:
            return _context2.finish(47);

          case 55:
            _iteratorNormalCompletion = true;
            _context2.next = 6;
            break;

          case 58:
            _context2.next = 64;
            break;

          case 60:
            _context2.prev = 60;
            _context2.t1 = _context2['catch'](4);
            _didIteratorError = true;
            _iteratorError = _context2.t1;

          case 64:
            _context2.prev = 64;
            _context2.prev = 65;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 67:
            _context2.prev = 67;

            if (!_didIteratorError) {
              _context2.next = 70;
              break;
            }

            throw _iteratorError;

          case 70:
            return _context2.finish(67);

          case 71:
            return _context2.finish(64);

          case 72:
            res.sendStatus(200);
            _context2.next = 78;
            break;

          case 75:
            _context2.prev = 75;
            _context2.t2 = _context2['catch'](0);

            next(_context2.t2);

          case 78:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee, undefined, [[0, 75], [4, 60, 64, 72], [11, 43, 47, 55], [48,, 50, 54], [65,, 67, 71]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

exports.default = router;