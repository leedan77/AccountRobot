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
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, entry, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, event, sender, payload, items, _items, _res, type, _items2, _res2, text, isDone, attachments, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, attachment, result;

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
              _context.next = 109;
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
              _context.next = 92;
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
            return _context.abrupt('continue', 89);

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
              _context.next = 89;
              break;
            }

            attachments = event.message.attachments;
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context.prev = 63;
            _iterator3 = attachments[Symbol.iterator]();

          case 65:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context.next = 75;
              break;
            }

            attachment = _step3.value;
            _context.next = 69;
            return (0, _upload.uploadPhoto)(attachment.payload.url);

          case 69:
            result = _context.sent;

            console.log(result);
            (0, _message.sendRapidReply)(result);

          case 72:
            _iteratorNormalCompletion3 = true;
            _context.next = 65;
            break;

          case 75:
            _context.next = 81;
            break;

          case 77:
            _context.prev = 77;
            _context.t0 = _context['catch'](63);
            _didIteratorError3 = true;
            _iteratorError3 = _context.t0;

          case 81:
            _context.prev = 81;
            _context.prev = 82;

            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }

          case 84:
            _context.prev = 84;

            if (!_didIteratorError3) {
              _context.next = 87;
              break;
            }

            throw _iteratorError3;

          case 87:
            return _context.finish(84);

          case 88:
            return _context.finish(81);

          case 89:
            _iteratorNormalCompletion2 = true;
            _context.next = 13;
            break;

          case 92:
            _context.next = 98;
            break;

          case 94:
            _context.prev = 94;
            _context.t1 = _context['catch'](11);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t1;

          case 98:
            _context.prev = 98;
            _context.prev = 99;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 101:
            _context.prev = 101;

            if (!_didIteratorError2) {
              _context.next = 104;
              break;
            }

            throw _iteratorError2;

          case 104:
            return _context.finish(101);

          case 105:
            return _context.finish(98);

          case 106:
            _iteratorNormalCompletion = true;
            _context.next = 6;
            break;

          case 109:
            _context.next = 115;
            break;

          case 111:
            _context.prev = 111;
            _context.t2 = _context['catch'](4);
            _didIteratorError = true;
            _iteratorError = _context.t2;

          case 115:
            _context.prev = 115;
            _context.prev = 116;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 118:
            _context.prev = 118;

            if (!_didIteratorError) {
              _context.next = 121;
              break;
            }

            throw _iteratorError;

          case 121:
            return _context.finish(118);

          case 122:
            return _context.finish(115);

          case 123:
            res.sendStatus(200);
            _context.next = 129;
            break;

          case 126:
            _context.prev = 126;
            _context.t3 = _context['catch'](0);

            next(_context.t3);

          case 129:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 126], [4, 111, 115, 123], [11, 94, 98, 106], [63, 77, 81, 89], [82,, 84, 88], [99,, 101, 105], [116,, 118, 122]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

exports.default = router;