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
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, entry, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, event, sender, payload, items, text, isDone;

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
              _context.next = 58;
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
              _context.next = 41;
              break;
            }

            event = _step2.value;
            sender = event.sender.id;

            console.log(JSON.stringify(event.message));

            if (!event.postback) {
              _context.next = 37;
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
            _context.next = 36;
            break;

          case 26:
            if (!(payload === 'CANCEL_ITEM')) {
              _context.next = 31;
              break;
            }

            (0, _message.sendTextMessage)(sender, "已取消新增項目");
            newItemFlag = false;
            _context.next = 36;
            break;

          case 31:
            if (!(payload === 'SHOW_RECORD')) {
              _context.next = 36;
              break;
            }

            _context.next = 34;
            return (0, _item.getAllItems)(sender);

          case 34:
            items = _context.sent;

            (0, _message.sendTextMessage)(sender, items);

          case 36:
            return _context.abrupt('continue', 38);

          case 37:
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

          case 38:
            _iteratorNormalCompletion2 = true;
            _context.next = 13;
            break;

          case 41:
            _context.next = 47;
            break;

          case 43:
            _context.prev = 43;
            _context.t0 = _context['catch'](11);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t0;

          case 47:
            _context.prev = 47;
            _context.prev = 48;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 50:
            _context.prev = 50;

            if (!_didIteratorError2) {
              _context.next = 53;
              break;
            }

            throw _iteratorError2;

          case 53:
            return _context.finish(50);

          case 54:
            return _context.finish(47);

          case 55:
            _iteratorNormalCompletion = true;
            _context.next = 6;
            break;

          case 58:
            _context.next = 64;
            break;

          case 60:
            _context.prev = 60;
            _context.t1 = _context['catch'](4);
            _didIteratorError = true;
            _iteratorError = _context.t1;

          case 64:
            _context.prev = 64;
            _context.prev = 65;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 67:
            _context.prev = 67;

            if (!_didIteratorError) {
              _context.next = 70;
              break;
            }

            throw _iteratorError;

          case 70:
            return _context.finish(67);

          case 71:
            return _context.finish(64);

          case 72:
            res.sendStatus(200);
            _context.next = 78;
            break;

          case 75:
            _context.prev = 75;
            _context.t2 = _context['catch'](0);

            next(_context.t2);

          case 78:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 75], [4, 60, 64, 72], [11, 43, 47, 55], [48,, 50, 54], [65,, 67, 71]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

exports.default = router;