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

          (0, _message.sendTextMessage)(sender, '請輸入價錢');
          _context.next = 6;
          return "price";

        case 6:
          price = _context.sent;

          (0, _message.sendTextMessage)(sender, '請輸入類型');
          _context.next = 10;
          return "type";

        case 10:
          type = _context.sent;

          // sendTextMessage(sender, `類型: ${type}`)
          (0, _item.createNewItem)(sender, name, type, Number(price)).then(function (res) {
            (0, _message.sendTextMessage)(sender, '已儲存\n新的項目: ' + name + '\n價錢: ' + price + '\n種類: ' + type);
          }).catch(function (err) {
            console.error(err);
          });

        case 12:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

var itemFlow = void 0;

router.post('/', function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res, next) {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, entry, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, event, sender, payload, text, isDone;

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
              _context2.next = 42;
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
              _context2.next = 25;
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
              (0, _message.sendTextMessage)(sender, "請輸入商品名稱");
              newItemFlag = true;
              itemFlow = newItemFlow(sender);
              itemFlow.next();
            } else if (payload === 'CANCEL_ITEM') {
              (0, _message.sendTextMessage)(sender, "已取消新增項目");
              newItemFlag = false;
            }
            return _context2.abrupt('continue', 22);

          case 21:
            if (event.message && event.message.text && !event.message.is_echo) {
              text = event.message.text;

              if (newItemFlag) {
                isDone = itemFlow.next(text).done;

                if (isDone) {
                  newItemFlag = false;
                } /* else {
                  const buttons = [{
                    type: "postback",
                    title: "取消新增項目",
                    payload: "CANCEL_ITEM"
                  }];
                  const result = await sendButtonMessage(sender, "錯誤的格式, 請依序輸入: 商品名稱 價錢 類型", buttons);
                  } */
              }
            }

          case 22:
            _iteratorNormalCompletion2 = true;
            _context2.next = 13;
            break;

          case 25:
            _context2.next = 31;
            break;

          case 27:
            _context2.prev = 27;
            _context2.t0 = _context2['catch'](11);
            _didIteratorError2 = true;
            _iteratorError2 = _context2.t0;

          case 31:
            _context2.prev = 31;
            _context2.prev = 32;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 34:
            _context2.prev = 34;

            if (!_didIteratorError2) {
              _context2.next = 37;
              break;
            }

            throw _iteratorError2;

          case 37:
            return _context2.finish(34);

          case 38:
            return _context2.finish(31);

          case 39:
            _iteratorNormalCompletion = true;
            _context2.next = 6;
            break;

          case 42:
            _context2.next = 48;
            break;

          case 44:
            _context2.prev = 44;
            _context2.t1 = _context2['catch'](4);
            _didIteratorError = true;
            _iteratorError = _context2.t1;

          case 48:
            _context2.prev = 48;
            _context2.prev = 49;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 51:
            _context2.prev = 51;

            if (!_didIteratorError) {
              _context2.next = 54;
              break;
            }

            throw _iteratorError;

          case 54:
            return _context2.finish(51);

          case 55:
            return _context2.finish(48);

          case 56:
            res.sendStatus(200);
            _context2.next = 62;
            break;

          case 59:
            _context2.prev = 59;
            _context2.t2 = _context2['catch'](0);

            next(_context2.t2);

          case 62:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee, undefined, [[0, 59], [4, 44, 48, 56], [11, 27, 31, 39], [32,, 34, 38], [49,, 51, 55]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

exports.default = router;