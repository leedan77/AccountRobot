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
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, entry, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, event, sender, payload, items, _items, _res, type, _items2, _res2, text, query, _items3, _res3, attachments, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, attachment, _ref2, result, _res4, _attachments, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _attachment, loc;

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
              _context.next = 158;
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
              _context.next = 141;
              break;
            }

            event = _step2.value;
            sender = event.sender.id;

            console.log(JSON.stringify(event.message));

            if (!event.postback) {
              _context.next = 62;
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
            _context.next = 61;
            break;

          case 28:
            if (!(payload === 'CANCEL_ITEM')) {
              _context.next = 33;
              break;
            }

            (0, _message.sendTextMessage)(sender, "已取消新增項目");
            newItemFlag = 0;
            _context.next = 61;
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
            _context.next = 61;
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
            _context.next = 61;
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
            _context.next = 61;
            break;

          case 60:
            if (payload === 'SHOW_ITEM_MAP') {}

          case 61:
            return _context.abrupt('continue', 138);

          case 62:
            if (!(event.message && event.message.text && !event.message.is_echo)) {
              _context.next = 79;
              break;
            }

            text = event.message.text;

            if (!newItemFlag) {
              _context.next = 68;
              break;
            }

            newItemFlag = itemFlow.next(text).value;
            _context.next = 79;
            break;

          case 68:
            query = text.split(' ').reduce(function (acc, q) {
              var parsedQuery = (0, _item.parseQuery)(q);
              return Object.assign(acc, parsedQuery);
            }, {});

            console.log(query);
            _context.next = 72;
            return (0, _item.getFilterItems)(sender, 10, query);

          case 72:
            _items3 = _context.sent;

            if (!(_items3 == null)) {
              _context.next = 75;
              break;
            }

            return _context.abrupt('continue', 138);

          case 75:
            _context.next = 77;
            return (0, _message.sendGenericMessage)(sender, _items3);

          case 77:
            _res3 = _context.sent;

            console.log(_items3);

          case 79:
            if (!(event.message && event.message.attachments && !event.message.is_echo)) {
              _context.next = 138;
              break;
            }

            if (!(newItemFlag === 'name')) {
              _context.next = 117;
              break;
            }

            attachments = event.message.attachments;
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context.prev = 85;
            _iterator3 = attachments[Symbol.iterator]();

          case 87:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context.next = 101;
              break;
            }

            attachment = _step3.value;
            _context.next = 91;
            return (0, _upload.uploadPhoto)(attachment.payload.url);

          case 91:
            _ref2 = _context.sent;
            result = _ref2.result;

            item.image = attachment.payload.url;
            item.save();
            _context.next = 97;
            return (0, _message.sendRapidReply)(sender, "選取符合的名字", result);

          case 97:
            _res4 = _context.sent;

          case 98:
            _iteratorNormalCompletion3 = true;
            _context.next = 87;
            break;

          case 101:
            _context.next = 107;
            break;

          case 103:
            _context.prev = 103;
            _context.t0 = _context['catch'](85);
            _didIteratorError3 = true;
            _iteratorError3 = _context.t0;

          case 107:
            _context.prev = 107;
            _context.prev = 108;

            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }

          case 110:
            _context.prev = 110;

            if (!_didIteratorError3) {
              _context.next = 113;
              break;
            }

            throw _iteratorError3;

          case 113:
            return _context.finish(110);

          case 114:
            return _context.finish(107);

          case 115:
            _context.next = 138;
            break;

          case 117:
            if (!(newItemFlag === 'location')) {
              _context.next = 138;
              break;
            }

            _attachments = event.message.attachments;
            _iteratorNormalCompletion4 = true;
            _didIteratorError4 = false;
            _iteratorError4 = undefined;
            _context.prev = 122;

            for (_iterator4 = _attachments[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              _attachment = _step4.value;
              loc = _attachment.payload.coordinates;

              newItemFlag = itemFlow.next(loc).value;
            }
            _context.next = 130;
            break;

          case 126:
            _context.prev = 126;
            _context.t1 = _context['catch'](122);
            _didIteratorError4 = true;
            _iteratorError4 = _context.t1;

          case 130:
            _context.prev = 130;
            _context.prev = 131;

            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }

          case 133:
            _context.prev = 133;

            if (!_didIteratorError4) {
              _context.next = 136;
              break;
            }

            throw _iteratorError4;

          case 136:
            return _context.finish(133);

          case 137:
            return _context.finish(130);

          case 138:
            _iteratorNormalCompletion2 = true;
            _context.next = 13;
            break;

          case 141:
            _context.next = 147;
            break;

          case 143:
            _context.prev = 143;
            _context.t2 = _context['catch'](11);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t2;

          case 147:
            _context.prev = 147;
            _context.prev = 148;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 150:
            _context.prev = 150;

            if (!_didIteratorError2) {
              _context.next = 153;
              break;
            }

            throw _iteratorError2;

          case 153:
            return _context.finish(150);

          case 154:
            return _context.finish(147);

          case 155:
            _iteratorNormalCompletion = true;
            _context.next = 6;
            break;

          case 158:
            _context.next = 164;
            break;

          case 160:
            _context.prev = 160;
            _context.t3 = _context['catch'](4);
            _didIteratorError = true;
            _iteratorError = _context.t3;

          case 164:
            _context.prev = 164;
            _context.prev = 165;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 167:
            _context.prev = 167;

            if (!_didIteratorError) {
              _context.next = 170;
              break;
            }

            throw _iteratorError;

          case 170:
            return _context.finish(167);

          case 171:
            return _context.finish(164);

          case 172:
            res.sendStatus(200);
            _context.next = 178;
            break;

          case 175:
            _context.prev = 175;
            _context.t4 = _context['catch'](0);

            next(_context.t4);

          case 178:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 175], [4, 160, 164, 172], [11, 143, 147, 155], [85, 103, 107, 115], [108,, 110, 114], [122, 126, 130, 138], [131,, 133, 137], [148,, 150, 154], [165,, 167, 171]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

exports.default = router;