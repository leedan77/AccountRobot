'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _message = require('../controllers/message');

var _item = require('../controllers/item');

var _newItem = require('../controllers/flow/newItem');

var _newItem2 = _interopRequireDefault(_newItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var router = new _express.Router();

router.get('/', function (req, res) {
  if (req.query['hub.verify_token'] === 'i_am_a_token_hehe') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong token');
});

var newItemFlag = false;

var itemFlow = void 0;

router.post('/', function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res, next) {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, entry, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, event, sender, payload, items, _items, type, _items2, _res, text, isDone;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 4;
            _iterator = req.body.entry[Symbol.iterator]();

          case 6:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 79;
              break;
            }

            entry = _step.value;
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context.prev = 11;
            _iterator2 = entry.messaging[Symbol.iterator]();

          case 13:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context.next = 62;
              break;
            }

            event = _step2.value;
            sender = event.sender.id;

            console.log(JSON.stringify(event.message));

            if (!event.postback) {
              _context.next = 58;
              break;
            }

            payload = event.postback.payload;

            if (!(payload === 'NEW_ITEM')) {
              _context.next = 26;
              break;
            }

            (0, _message.sendTextMessage)(sender, "請輸入商品名稱");
            newItemFlag = true;
            itemFlow = (0, _newItem2.default)(sender);
            itemFlow.next();
            _context.next = 57;
            break;

          case 26:
            if (!(payload === 'CANCEL_ITEM')) {
              _context.next = 31;
              break;
            }

            (0, _message.sendTextMessage)(sender, "已取消新增項目");
            newItemFlag = false;
            _context.next = 57;
            break;

          case 31:
            if (!(payload === 'SHOW_RECORD')) {
              _context.next = 40;
              break;
            }

            _context.next = 34;
            return (0, _item.getAllItems)(sender);

          case 34:
            items = _context.sent;

            console.log(items);
            _context.next = 38;
            return (0, _message.sendReceipt)(sender, items);

          case 38:
            _context.next = 57;
            break;

          case 40:
            if (!(payload === 'SHOW_CARD')) {
              _context.next = 48;
              break;
            }

            _context.next = 43;
            return (0, _item.getAllItems)(sender);

          case 43:
            _items = _context.sent;
            _context.next = 46;
            return (0, _message.sendGenericMessage)(sender, _items);

          case 46:
            _context.next = 57;
            break;

          case 48:
            if (!payload.startsWith('TYPE_')) {
              _context.next = 57;
              break;
            }

            type = payload.replace('TYPE_', '');
            _context.next = 52;
            return (0, _item.getSameTypeItems)(type);

          case 52:
            _items2 = _context.sent;
            _context.next = 55;
            return (0, _message.sendGenericMessage)(sender, _items2);

          case 55:
            _res = _context.sent;

            console.log(_res);

          case 57:
            return _context.abrupt('continue', 59);

          case 58:
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

          case 59:
            _iteratorNormalCompletion2 = true;
            _context.next = 13;
            break;

          case 62:
            _context.next = 68;
            break;

          case 64:
            _context.prev = 64;
            _context.t0 = _context['catch'](11);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t0;

          case 68:
            _context.prev = 68;
            _context.prev = 69;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 71:
            _context.prev = 71;

            if (!_didIteratorError2) {
              _context.next = 74;
              break;
            }

            throw _iteratorError2;

          case 74:
            return _context.finish(71);

          case 75:
            return _context.finish(68);

          case 76:
            _iteratorNormalCompletion = true;
            _context.next = 6;
            break;

          case 79:
            _context.next = 85;
            break;

          case 81:
            _context.prev = 81;
            _context.t1 = _context['catch'](4);
            _didIteratorError = true;
            _iteratorError = _context.t1;

          case 85:
            _context.prev = 85;
            _context.prev = 86;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 88:
            _context.prev = 88;

            if (!_didIteratorError) {
              _context.next = 91;
              break;
            }

            throw _iteratorError;

          case 91:
            return _context.finish(88);

          case 92:
            return _context.finish(85);

          case 93:
            res.sendStatus(200);
            _context.next = 99;
            break;

          case 96:
            _context.prev = 96;
            _context.t2 = _context['catch'](0);

            next(_context.t2);

          case 99:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 96], [4, 81, 85, 93], [11, 64, 68, 76], [69,, 71, 75], [86,, 88, 92]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

exports.default = router;