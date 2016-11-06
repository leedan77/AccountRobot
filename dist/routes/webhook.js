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
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, entry, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, event, sender, payload, items, _items, _res, type, _items2, _res2, _res3, text, query, _items3, _res4, attachments, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, attachment, _ref2, result, _res5, _attachments, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _attachment, loc;

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
              _context.next = 161;
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
              _context.next = 144;
              break;
            }

            event = _step2.value;
            sender = event.sender.id;

            console.log(JSON.stringify(event.message));

            if (!event.postback) {
              _context.next = 65;
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
            _context.next = 64;
            break;

          case 28:
            if (!(payload === 'CANCEL_ITEM')) {
              _context.next = 33;
              break;
            }

            (0, _message.sendTextMessage)(sender, "已取消新增項目");
            newItemFlag = 0;
            _context.next = 64;
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
            _context.next = 64;
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
            _context.next = 64;
            break;

          case 50:
            if (!payload.startsWith('TYPE_')) {
              _context.next = 60;
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
            _context.next = 64;
            break;

          case 60:
            if (!(payload === 'SHOW_ITEM_MAP')) {
              _context.next = 64;
              break;
            }

            _context.next = 63;
            return (0, _message.sendLocationMap)(sender);

          case 63:
            _res3 = _context.sent;

          case 64:
            return _context.abrupt('continue', 141);

          case 65:
            if (!(event.message && event.message.text && !event.message.is_echo)) {
              _context.next = 82;
              break;
            }

            text = event.message.text;

            if (!newItemFlag) {
              _context.next = 71;
              break;
            }

            newItemFlag = itemFlow.next(text).value;
            _context.next = 82;
            break;

          case 71:
            query = text.split(' ').reduce(function (acc, q) {
              var parsedQuery = (0, _item.parseQuery)(q);
              return Object.assign(acc, parsedQuery);
            }, {});

            console.log(query);
            _context.next = 75;
            return (0, _item.getFilterItems)(sender, 10, query);

          case 75:
            _items3 = _context.sent;

            if (!(_items3 == null)) {
              _context.next = 78;
              break;
            }

            return _context.abrupt('continue', 141);

          case 78:
            _context.next = 80;
            return (0, _message.sendGenericMessage)(sender, _items3);

          case 80:
            _res4 = _context.sent;

            console.log(_items3);

          case 82:
            if (!(event.message && event.message.attachments && !event.message.is_echo)) {
              _context.next = 141;
              break;
            }

            if (!(newItemFlag === 'name')) {
              _context.next = 120;
              break;
            }

            attachments = event.message.attachments;
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context.prev = 88;
            _iterator3 = attachments[Symbol.iterator]();

          case 90:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context.next = 104;
              break;
            }

            attachment = _step3.value;
            _context.next = 94;
            return (0, _upload.uploadPhoto)(attachment.payload.url);

          case 94:
            _ref2 = _context.sent;
            result = _ref2.result;

            item.image = attachment.payload.url;
            item.save();
            _context.next = 100;
            return (0, _message.sendRapidReply)(sender, "選取符合的名字", result);

          case 100:
            _res5 = _context.sent;

          case 101:
            _iteratorNormalCompletion3 = true;
            _context.next = 90;
            break;

          case 104:
            _context.next = 110;
            break;

          case 106:
            _context.prev = 106;
            _context.t0 = _context['catch'](88);
            _didIteratorError3 = true;
            _iteratorError3 = _context.t0;

          case 110:
            _context.prev = 110;
            _context.prev = 111;

            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }

          case 113:
            _context.prev = 113;

            if (!_didIteratorError3) {
              _context.next = 116;
              break;
            }

            throw _iteratorError3;

          case 116:
            return _context.finish(113);

          case 117:
            return _context.finish(110);

          case 118:
            _context.next = 141;
            break;

          case 120:
            if (!(newItemFlag === 'location')) {
              _context.next = 141;
              break;
            }

            _attachments = event.message.attachments;
            _iteratorNormalCompletion4 = true;
            _didIteratorError4 = false;
            _iteratorError4 = undefined;
            _context.prev = 125;

            for (_iterator4 = _attachments[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              _attachment = _step4.value;
              loc = _attachment.payload.coordinates;

              newItemFlag = itemFlow.next(loc).value;
            }
            _context.next = 133;
            break;

          case 129:
            _context.prev = 129;
            _context.t1 = _context['catch'](125);
            _didIteratorError4 = true;
            _iteratorError4 = _context.t1;

          case 133:
            _context.prev = 133;
            _context.prev = 134;

            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }

          case 136:
            _context.prev = 136;

            if (!_didIteratorError4) {
              _context.next = 139;
              break;
            }

            throw _iteratorError4;

          case 139:
            return _context.finish(136);

          case 140:
            return _context.finish(133);

          case 141:
            _iteratorNormalCompletion2 = true;
            _context.next = 13;
            break;

          case 144:
            _context.next = 150;
            break;

          case 146:
            _context.prev = 146;
            _context.t2 = _context['catch'](11);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t2;

          case 150:
            _context.prev = 150;
            _context.prev = 151;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 153:
            _context.prev = 153;

            if (!_didIteratorError2) {
              _context.next = 156;
              break;
            }

            throw _iteratorError2;

          case 156:
            return _context.finish(153);

          case 157:
            return _context.finish(150);

          case 158:
            _iteratorNormalCompletion = true;
            _context.next = 6;
            break;

          case 161:
            _context.next = 167;
            break;

          case 163:
            _context.prev = 163;
            _context.t3 = _context['catch'](4);
            _didIteratorError = true;
            _iteratorError = _context.t3;

          case 167:
            _context.prev = 167;
            _context.prev = 168;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 170:
            _context.prev = 170;

            if (!_didIteratorError) {
              _context.next = 173;
              break;
            }

            throw _iteratorError;

          case 173:
            return _context.finish(170);

          case 174:
            return _context.finish(167);

          case 175:
            res.sendStatus(200);
            _context.next = 181;
            break;

          case 178:
            _context.prev = 178;
            _context.t4 = _context['catch'](0);

            next(_context.t4);

          case 181:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 178], [4, 163, 167, 175], [11, 146, 150, 158], [88, 106, 110, 118], [111,, 113, 117], [125, 129, 133, 141], [134,, 136, 140], [151,, 153, 157], [168,, 170, 174]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

exports.default = router;