'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = newItemFlow;

var _message = require('../message');

var _item = require('../item');

var _marked = [newItemFlow].map(regeneratorRuntime.mark);

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

          (0, _message.sendRapidReply)(sender, '請選取類型或自行輸入', ['食', '衣', '住', '行', '樂']).then(function (res) {
            console.log(res);
          }).catch(function (err) {
            console.error(err);
          });
          _context.next = 10;
          return "type";

        case 10:
          type = _context.sent;

          (0, _item.createNewItem)(sender, name, type, Number(price)).then(function (res) {
            (0, _message.sendTextMessage)(sender, '已儲存\n新的項目: ' + name + '\n價錢: ' + price + '\n種類: ' + type);
            sendLinkMessage(sender, name).then(function (res) {
              console.log(res);
            }).catch(function (err) {
              console.error(err);
            });
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