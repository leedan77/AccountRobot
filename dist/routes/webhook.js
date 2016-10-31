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
              _context.next = 132;
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
              _context.next = 115;
              break;
            }

            event = _step2.value;
            sender = event.sender.id;

            console.log(JSON.stringify(event.message));

            if (!event.postback) {
              _context.next = 59;
              break;
            }

            payload = event.postback.payload;

            if (!(payload === 'NEW_ITEM')) {
              _context.next = 28;
              break;
            }

            item = new _item3.default();
            _context.next = 23;
            return item.save();

          case 23:
            (0, _message.sendTextMessage)(sender, "請輸入商品名稱");
            itemFlow = (0, _newItem2.default)(sender, item);
            newItemFlag = itemFlow.next().value;
            _context.next = 58;
            break;

          case 28:
            if (!(payload === 'CANCEL_ITEM')) {
              _context.next = 33;
              break;
            }

            (0, _message.sendTextMessage)(sender, "已取消新增項目");
            newItemFlag = 0;
            _context.next = 58;
            break;

          case 33:
            if (!(payload === 'SHOW_RECORD')) {
              _context.next = 41;
              break;
            }

            _context.next = 36;
            return (0, _item.getAllItems)(sender);

          case 36:
            items = _context.sent;
            _context.next = 39;
            return (0, _message.sendReceipt)(sender, items);

          case 39:
            _context.next = 58;
            break;

          case 41:
            if (!(payload === 'SHOW_CARD')) {
              _context.next = 50;
              break;
            }

            _context.next = 44;
            return (0, _item.getAllItems)(sender, 10);

          case 44:
            _items = _context.sent;
            _context.next = 47;
            return (0, _message.sendGenericMessage)(sender, _items);

          case 47:
            _res = _context.sent;
            _context.next = 58;
            break;

          case 50:
            if (!payload.startsWith('TYPE_')) {
              _context.next = 58;
              break;
            }

            type = payload.replace('TYPE_', '');
            _context.next = 54;
            return (0, _item.getSameTypeItems)(type);

          case 54:
            _items2 = _context.sent;
            _context.next = 57;
            return (0, _message.sendGenericMessage)(sender, _items2);

          case 57:
            _res2 = _context.sent;

          case 58:
            return _context.abrupt('continue', 112);

          case 59:
            if (!(event.message && event.message.text && !event.message.is_echo)) {
              _context.next = 76;
              break;
            }

            text = event.message.text;

            if (!newItemFlag) {
              _context.next = 65;
              break;
            }

            _newItemFlag = itemFlow.next(text).value;
            _context.next = 76;
            break;

          case 65:
            query = text.split(' ').reduce(function (acc, q) {
              var parsedQuery = (0, _item.parseQuery)(q);
              return Object.assign(acc, parsedQuery);
            }, {});

            console.log(query);
            _context.next = 69;
            return (0, _item.getFilterItems)(sender, 10, query);

          case 69:
            _items3 = _context.sent;

            if (!(_items3 == null)) {
              _context.next = 72;
              break;
            }

            return _context.abrupt('continue', 112);

          case 72:
            _context.next = 74;
            return (0, _message.sendGenericMessage)(sender, _items3);

          case 74:
            _res3 = _context.sent;

            console.log(_items3);

          case 76:
            if (!(event.message && event.message.attachments && !event.message.is_echo)) {
              _context.next = 112;
              break;
            }

            if (!(newItemFlag === 'name')) {
              _context.next = 112;
              break;
            }

            attachments = event.message.attachments;
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context.prev = 82;
            _iterator3 = attachments[Symbol.iterator]();

          case 84:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context.next = 98;
              break;
            }

            attachment = _step3.value;
            _context.next = 88;
            return (0, _upload.uploadPhoto)(attachment.payload.url);

          case 88:
            _ref2 = _context.sent;
            result = _ref2.result;

            item.image = attachment.payload.url;
            item.save();
            _context.next = 94;
            return (0, _message.sendRapidReply)(sender, "選取符合的名字", result);

          case 94:
            _res4 = _context.sent;

          case 95:
            _iteratorNormalCompletion3 = true;
            _context.next = 84;
            break;

          case 98:
            _context.next = 104;
            break;

          case 100:
            _context.prev = 100;
            _context.t0 = _context['catch'](82);
            _didIteratorError3 = true;
            _iteratorError3 = _context.t0;

          case 104:
            _context.prev = 104;
            _context.prev = 105;

            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }

          case 107:
            _context.prev = 107;

            if (!_didIteratorError3) {
              _context.next = 110;
              break;
            }

            throw _iteratorError3;

          case 110:
            return _context.finish(107);

          case 111:
            return _context.finish(104);

          case 112:
            _iteratorNormalCompletion2 = true;
            _context.next = 13;
            break;

          case 115:
            _context.next = 121;
            break;

          case 117:
            _context.prev = 117;
            _context.t1 = _context['catch'](11);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t1;

          case 121:
            _context.prev = 121;
            _context.prev = 122;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 124:
            _context.prev = 124;

            if (!_didIteratorError2) {
              _context.next = 127;
              break;
            }

            throw _iteratorError2;

          case 127:
            return _context.finish(124);

          case 128:
            return _context.finish(121);

          case 129:
            _iteratorNormalCompletion = true;
            _context.next = 6;
            break;

          case 132:
            _context.next = 138;
            break;

          case 134:
            _context.prev = 134;
            _context.t2 = _context['catch'](4);
            _didIteratorError = true;
            _iteratorError = _context.t2;

          case 138:
            _context.prev = 138;
            _context.prev = 139;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 141:
            _context.prev = 141;

            if (!_didIteratorError) {
              _context.next = 144;
              break;
            }

            throw _iteratorError;

          case 144:
            return _context.finish(141);

          case 145:
            return _context.finish(138);

          case 146:
            res.sendStatus(200);
            _context.next = 152;
            break;

          case 149:
            _context.prev = 149;
            _context.t3 = _context['catch'](0);

            next(_context.t3);

          case 152:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 149], [4, 134, 138, 146], [11, 117, 121, 129], [82, 100, 104, 112], [105,, 107, 111], [122,, 124, 128], [139,, 141, 145]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

exports.default = router;