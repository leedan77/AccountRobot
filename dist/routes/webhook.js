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

function newItemFlow(sender) {
  var name, price, type;
  return regeneratorRuntime.wrap(function newItemFlow$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return "name";

        case 2:
          name = _context.sent;

          (0, _message.sendTextMessage)(sender, '商品名稱: ' + name);
          _context.next = 6;
          return "price";

        case 6:
          price = _context.sent;

          (0, _message.sendTextMessage)(sender, '價錢: ' + price);
          _context.next = 10;
          return "type";

        case 10:
          type = _context.sent;

          (0, _message.sendTextMessage)(sender, '類型: ' + type);
          (0, _item.createNewItem)(sender, name, type, price).then(function (res) {
            (0, _message.sendTextMessage)(sender, '已儲存 新的項目: ' + name + ', 價錢: ' + price + ', 種類: ' + type);
          }).catch(function (err) {
            console.error(err);
          });

        case 13:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

var itemFlow = void 0;

router.post('/', function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res, next) {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, entry, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, event, sender, payload, text, arrStr, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, str, isDone, buttons, result;

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
              _context2.next = 80;
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
              _context2.next = 63;
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
              itemFlow = newItemFlow(sender);
              itemFlow.next();
            } else if (payload === 'CANCEL_ITEM') {
              (0, _message.sendTextMessage)(sender, "已取消新增項目");
              newItemFlag = false;
            }
            return _context2.abrupt('continue', 60);

          case 21:
            if (!(event.message && event.message.text && !event.message.is_echo)) {
              _context2.next = 60;
              break;
            }

            text = event.message.text;

            if (!newItemFlag) {
              _context2.next = 60;
              break;
            }

            arrStr = text.split(' ');

            if (!(arrStr.length <= 3)) {
              _context2.next = 56;
              break;
            }

            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context2.prev = 29;
            _iterator3 = arrStr[Symbol.iterator]();

          case 31:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context2.next = 40;
              break;
            }

            str = _step3.value;
            isDone = itemFlow.next(str).done;

            if (!isDone) {
              _context2.next = 37;
              break;
            }

            newItemFlag = false;
            return _context2.abrupt('break', 40);

          case 37:
            _iteratorNormalCompletion3 = true;
            _context2.next = 31;
            break;

          case 40:
            _context2.next = 46;
            break;

          case 42:
            _context2.prev = 42;
            _context2.t0 = _context2['catch'](29);
            _didIteratorError3 = true;
            _iteratorError3 = _context2.t0;

          case 46:
            _context2.prev = 46;
            _context2.prev = 47;

            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }

          case 49:
            _context2.prev = 49;

            if (!_didIteratorError3) {
              _context2.next = 52;
              break;
            }

            throw _iteratorError3;

          case 52:
            return _context2.finish(49);

          case 53:
            return _context2.finish(46);

          case 54:
            _context2.next = 60;
            break;

          case 56:
            buttons = [{
              type: "postback",
              title: "取消新增項目",
              payload: "CANCEL_ITEM"
            }];
            _context2.next = 59;
            return (0, _message.sendButtonMessage)(sender, "錯誤的格式, 請依序輸入: 商品名稱 價錢 類型", buttons);

          case 59:
            result = _context2.sent;

          case 60:
            _iteratorNormalCompletion2 = true;
            _context2.next = 13;
            break;

          case 63:
            _context2.next = 69;
            break;

          case 65:
            _context2.prev = 65;
            _context2.t1 = _context2['catch'](11);
            _didIteratorError2 = true;
            _iteratorError2 = _context2.t1;

          case 69:
            _context2.prev = 69;
            _context2.prev = 70;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 72:
            _context2.prev = 72;

            if (!_didIteratorError2) {
              _context2.next = 75;
              break;
            }

            throw _iteratorError2;

          case 75:
            return _context2.finish(72);

          case 76:
            return _context2.finish(69);

          case 77:
            _iteratorNormalCompletion = true;
            _context2.next = 6;
            break;

          case 80:
            _context2.next = 86;
            break;

          case 82:
            _context2.prev = 82;
            _context2.t2 = _context2['catch'](4);
            _didIteratorError = true;
            _iteratorError = _context2.t2;

          case 86:
            _context2.prev = 86;
            _context2.prev = 87;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 89:
            _context2.prev = 89;

            if (!_didIteratorError) {
              _context2.next = 92;
              break;
            }

            throw _iteratorError;

          case 92:
            return _context2.finish(89);

          case 93:
            return _context2.finish(86);

          case 94:
            res.sendStatus(200);
            _context2.next = 100;
            break;

          case 97:
            _context2.prev = 97;
            _context2.t3 = _context2['catch'](0);

            next(_context2.t3);

          case 100:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee, undefined, [[0, 97], [4, 82, 86, 94], [11, 65, 69, 77], [29, 42, 46, 54], [47,, 49, 53], [70,, 72, 76], [87,, 89, 93]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

exports.default = router;