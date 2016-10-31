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

var _item2 = require('../models/item');

var _item3 = _interopRequireDefault(_item2);

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
var item = void 0;

router.post('/', function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res, next) {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, entry, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, event, sender, payload, items, _items, _res, type, _items2, _res2, text, _newItemFlag, query, _items3, _res3, attachments, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, attachment, _ref2, result, _res4;

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
              _context.next = 130;
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
              _context.next = 113;
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

            item = new _item3.default();
            (0, _message.sendTextMessage)(sender, "請輸入商品名稱");
            itemFlow = (0, _newItem2.default)(sender, item);
            newItemFlag = itemFlow.next().value;
            _context.next = 56;
            break;

          case 26:
            if (!(payload === 'CANCEL_ITEM')) {
              _context.next = 31;
              break;
            }

            (0, _message.sendTextMessage)(sender, "已取消新增項目");
            newItemFlag = 0;
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
            return _context.abrupt('continue', 110);

          case 57:
            if (!(event.message && event.message.text && !event.message.is_echo)) {
              _context.next = 74;
              break;
            }

            text = event.message.text;

            if (!newItemFlag) {
              _context.next = 63;
              break;
            }

            _newItemFlag = itemFlow.next(text).value;
            _context.next = 74;
            break;

          case 63:
            query = text.split(' ').reduce(function (acc, q) {
              var parsedQuery = (0, _item.parseQuery)(q);
              return Object.assign(acc, parsedQuery);
            }, {});

            console.log(query);
            _context.next = 67;
            return (0, _item.getFilterItems)(sender, 10, query);

          case 67:
            _items3 = _context.sent;

            if (!(_items3 == null)) {
              _context.next = 70;
              break;
            }

            return _context.abrupt('continue', 110);

          case 70:
            _context.next = 72;
            return (0, _message.sendGenericMessage)(sender, _items3);

          case 72:
            _res3 = _context.sent;

            console.log(_items3);

          case 74:
            if (!(event.message && event.message.attachments && !event.message.is_echo)) {
              _context.next = 110;
              break;
            }

            if (!(newItemFlag === 'name')) {
              _context.next = 110;
              break;
            }

            attachments = event.message.attachments;
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context.prev = 80;
            _iterator3 = attachments[Symbol.iterator]();

          case 82:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context.next = 96;
              break;
            }

            attachment = _step3.value;
            _context.next = 86;
            return (0, _upload.uploadPhoto)(attachment.payload.url);

          case 86:
            _ref2 = _context.sent;
            result = _ref2.result;

            item.image = attachment.payload.url;
            item.save();
            _context.next = 92;
            return (0, _message.sendRapidReply)(sender, "選取符合的名字", result);

          case 92:
            _res4 = _context.sent;

          case 93:
            _iteratorNormalCompletion3 = true;
            _context.next = 82;
            break;

          case 96:
            _context.next = 102;
            break;

          case 98:
            _context.prev = 98;
            _context.t0 = _context['catch'](80);
            _didIteratorError3 = true;
            _iteratorError3 = _context.t0;

          case 102:
            _context.prev = 102;
            _context.prev = 103;

            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }

          case 105:
            _context.prev = 105;

            if (!_didIteratorError3) {
              _context.next = 108;
              break;
            }

            throw _iteratorError3;

          case 108:
            return _context.finish(105);

          case 109:
            return _context.finish(102);

          case 110:
            _iteratorNormalCompletion2 = true;
            _context.next = 13;
            break;

          case 113:
            _context.next = 119;
            break;

          case 115:
            _context.prev = 115;
            _context.t1 = _context['catch'](11);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t1;

          case 119:
            _context.prev = 119;
            _context.prev = 120;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 122:
            _context.prev = 122;

            if (!_didIteratorError2) {
              _context.next = 125;
              break;
            }

            throw _iteratorError2;

          case 125:
            return _context.finish(122);

          case 126:
            return _context.finish(119);

          case 127:
            _iteratorNormalCompletion = true;
            _context.next = 6;
            break;

          case 130:
            _context.next = 136;
            break;

          case 132:
            _context.prev = 132;
            _context.t2 = _context['catch'](4);
            _didIteratorError = true;
            _iteratorError = _context.t2;

          case 136:
            _context.prev = 136;
            _context.prev = 137;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 139:
            _context.prev = 139;

            if (!_didIteratorError) {
              _context.next = 142;
              break;
            }

            throw _iteratorError;

          case 142:
            return _context.finish(139);

          case 143:
            return _context.finish(136);

          case 144:
            res.sendStatus(200);
            _context.next = 150;
            break;

          case 147:
            _context.prev = 147;
            _context.t3 = _context['catch'](0);

            next(_context.t3);

          case 150:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 147], [4, 132, 136, 144], [11, 115, 119, 127], [80, 98, 102, 110], [103,, 105, 109], [120,, 122, 126], [137,, 139, 143]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

exports.default = router;