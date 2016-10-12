'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _message = require('../controllers/message');

var _item = require('../controllers/item');

var _upload = require('../controllers/upload');

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
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, entry, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, event, sender, payload, items, _items, _res, type, _items2, _res2, text, isDone, attachments, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, attachment;

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
              _context.next = 99;
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
              _context.next = 82;
              break;
            }

            event = _step2.value;
            sender = event.sender.id;

            console.log(JSON.stringify(event.message));

            if (!event.postback) {
              _context.next = 57;
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
            _context.next = 56;
            break;

          case 26:
            if (!(payload === 'CANCEL_ITEM')) {
              _context.next = 31;
              break;
            }

            (0, _message.sendTextMessage)(sender, "已取消新增項目");
            newItemFlag = false;
            _context.next = 56;
            break;

          case 31:
            if (!(payload === 'SHOW_RECORD')) {
              _context.next = 39;
              break;
            }

            _context.next = 34;
            return (0, _item.getAllItems)(sender);

          case 34:
            items = _context.sent;
            _context.next = 37;
            return (0, _message.sendReceipt)(sender, items);

          case 37:
            _context.next = 56;
            break;

          case 39:
            if (!(payload === 'SHOW_CARD')) {
              _context.next = 48;
              break;
            }

            _context.next = 42;
            return (0, _item.getAllItems)(sender, 10);

          case 42:
            _items = _context.sent;
            _context.next = 45;
            return (0, _message.sendGenericMessage)(sender, _items);

          case 45:
            _res = _context.sent;
            _context.next = 56;
            break;

          case 48:
            if (!payload.startsWith('TYPE_')) {
              _context.next = 56;
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
            _res2 = _context.sent;

          case 56:
            return _context.abrupt('continue', 79);

          case 57:
            if (event.message && event.message.text && !event.message.is_echo) {
              text = event.message.text;

              if (newItemFlag) {
                isDone = itemFlow.next(text).done;

                if (isDone) {
                  newItemFlag = false;
                }
              }
            }
            // attachment

            if (!event.message.attachments) {
              _context.next = 79;
              break;
            }

            attachments = event.message.attachments;
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context.prev = 63;

            for (_iterator3 = attachments[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              attachment = _step3.value;

              (0, _upload.uploadPhoto)(attachment.payload.url).catch(function (err) {
                console.log(err);
              });
            }
            _context.next = 71;
            break;

          case 67:
            _context.prev = 67;
            _context.t0 = _context['catch'](63);
            _didIteratorError3 = true;
            _iteratorError3 = _context.t0;

          case 71:
            _context.prev = 71;
            _context.prev = 72;

            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }

          case 74:
            _context.prev = 74;

            if (!_didIteratorError3) {
              _context.next = 77;
              break;
            }

            throw _iteratorError3;

          case 77:
            return _context.finish(74);

          case 78:
            return _context.finish(71);

          case 79:
            _iteratorNormalCompletion2 = true;
            _context.next = 13;
            break;

          case 82:
            _context.next = 88;
            break;

          case 84:
            _context.prev = 84;
            _context.t1 = _context['catch'](11);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t1;

          case 88:
            _context.prev = 88;
            _context.prev = 89;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 91:
            _context.prev = 91;

            if (!_didIteratorError2) {
              _context.next = 94;
              break;
            }

            throw _iteratorError2;

          case 94:
            return _context.finish(91);

          case 95:
            return _context.finish(88);

          case 96:
            _iteratorNormalCompletion = true;
            _context.next = 6;
            break;

          case 99:
            _context.next = 105;
            break;

          case 101:
            _context.prev = 101;
            _context.t2 = _context['catch'](4);
            _didIteratorError = true;
            _iteratorError = _context.t2;

          case 105:
            _context.prev = 105;
            _context.prev = 106;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 108:
            _context.prev = 108;

            if (!_didIteratorError) {
              _context.next = 111;
              break;
            }

            throw _iteratorError;

          case 111:
            return _context.finish(108);

          case 112:
            return _context.finish(105);

          case 113:
            res.sendStatus(200);
            _context.next = 119;
            break;

          case 116:
            _context.prev = 116;
            _context.t3 = _context['catch'](0);

            next(_context.t3);

          case 119:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 116], [4, 101, 105, 113], [11, 84, 88, 96], [63, 67, 71, 79], [72,, 74, 78], [89,, 91, 95], [106,, 108, 112]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

exports.default = router;