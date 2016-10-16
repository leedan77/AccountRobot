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

var newItemFlag = 0;
var itemFlow = void 0;

router.post('/', function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res, next) {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, entry, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, event, sender, payload, items, _items, _res, type, _items2, _res2, text, _newItemFlag, attachments, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, attachment, _ref2, result, _res3;

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
              _context.next = 111;
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
              _context.next = 94;
              break;
            }

            event = _step2.value;
            sender = event.sender.id;

            console.log(JSON.stringify(event.message));

            if (!event.postback) {
              _context.next = 56;
              break;
            }

            payload = event.postback.payload;

            if (!(payload === 'NEW_ITEM')) {
              _context.next = 25;
              break;
            }

            (0, _message.sendTextMessage)(sender, "請輸入商品名稱");
            itemFlow = (0, _newItem2.default)(sender);
            newItemFlag = itemFlow.next().value;
            _context.next = 55;
            break;

          case 25:
            if (!(payload === 'CANCEL_ITEM')) {
              _context.next = 30;
              break;
            }

            (0, _message.sendTextMessage)(sender, "已取消新增項目");
            newItemFlag = 0;
            _context.next = 55;
            break;

          case 30:
            if (!(payload === 'SHOW_RECORD')) {
              _context.next = 38;
              break;
            }

            _context.next = 33;
            return (0, _item.getAllItems)(sender);

          case 33:
            items = _context.sent;
            _context.next = 36;
            return (0, _message.sendReceipt)(sender, items);

          case 36:
            _context.next = 55;
            break;

          case 38:
            if (!(payload === 'SHOW_CARD')) {
              _context.next = 47;
              break;
            }

            _context.next = 41;
            return (0, _item.getAllItems)(sender, 10);

          case 41:
            _items = _context.sent;
            _context.next = 44;
            return (0, _message.sendGenericMessage)(sender, _items);

          case 44:
            _res = _context.sent;
            _context.next = 55;
            break;

          case 47:
            if (!payload.startsWith('TYPE_')) {
              _context.next = 55;
              break;
            }

            type = payload.replace('TYPE_', '');
            _context.next = 51;
            return (0, _item.getSameTypeItems)(type);

          case 51:
            _items2 = _context.sent;
            _context.next = 54;
            return (0, _message.sendGenericMessage)(sender, _items2);

          case 54:
            _res2 = _context.sent;

          case 55:
            return _context.abrupt('continue', 91);

          case 56:
            if (event.message && event.message.text && !event.message.is_echo) {
              text = event.message.text;

              if (newItemFlag) {
                _newItemFlag = itemFlow.next(text).value;
              }
            }
            // attachment

            if (!(event.message && event.message.attachments)) {
              _context.next = 91;
              break;
            }

            if (!(newItemFlag === 'name')) {
              _context.next = 91;
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
              _context.next = 77;
              break;
            }

            attachment = _step3.value;
            _context.next = 69;
            return (0, _upload.uploadPhoto)(attachment.payload.url);

          case 69:
            _ref2 = _context.sent;
            result = _ref2.result;
            _context.next = 73;
            return (0, _message.sendRapidReply)(sender, result);

          case 73:
            _res3 = _context.sent;

          case 74:
            _iteratorNormalCompletion3 = true;
            _context.next = 65;
            break;

          case 77:
            _context.next = 83;
            break;

          case 79:
            _context.prev = 79;
            _context.t0 = _context['catch'](63);
            _didIteratorError3 = true;
            _iteratorError3 = _context.t0;

          case 83:
            _context.prev = 83;
            _context.prev = 84;

            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }

          case 86:
            _context.prev = 86;

            if (!_didIteratorError3) {
              _context.next = 89;
              break;
            }

            throw _iteratorError3;

          case 89:
            return _context.finish(86);

          case 90:
            return _context.finish(83);

          case 91:
            _iteratorNormalCompletion2 = true;
            _context.next = 13;
            break;

          case 94:
            _context.next = 100;
            break;

          case 96:
            _context.prev = 96;
            _context.t1 = _context['catch'](11);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t1;

          case 100:
            _context.prev = 100;
            _context.prev = 101;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 103:
            _context.prev = 103;

            if (!_didIteratorError2) {
              _context.next = 106;
              break;
            }

            throw _iteratorError2;

          case 106:
            return _context.finish(103);

          case 107:
            return _context.finish(100);

          case 108:
            _iteratorNormalCompletion = true;
            _context.next = 6;
            break;

          case 111:
            _context.next = 117;
            break;

          case 113:
            _context.prev = 113;
            _context.t2 = _context['catch'](4);
            _didIteratorError = true;
            _iteratorError = _context.t2;

          case 117:
            _context.prev = 117;
            _context.prev = 118;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 120:
            _context.prev = 120;

            if (!_didIteratorError) {
              _context.next = 123;
              break;
            }

            throw _iteratorError;

          case 123:
            return _context.finish(120);

          case 124:
            return _context.finish(117);

          case 125:
            res.sendStatus(200);
            _context.next = 131;
            break;

          case 128:
            _context.prev = 128;
            _context.t3 = _context['catch'](0);

            next(_context.t3);

          case 131:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 128], [4, 113, 117, 125], [11, 96, 100, 108], [63, 79, 83, 91], [84,, 86, 90], [101,, 103, 107], [118,, 120, 124]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

exports.default = router;