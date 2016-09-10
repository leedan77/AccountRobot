'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createNewItem = undefined;

var createNewItem = exports.createNewItem = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(userID, name, type, price) {
    var item;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            item = new _item2.default({ userID: userID, name: name, type: type, price: price });
            _context.next = 3;
            return item.save();

          case 3:
            return _context.abrupt('return', item);

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function createNewItem(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

var _item = require('../models/item');

var _item2 = _interopRequireDefault(_item);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }