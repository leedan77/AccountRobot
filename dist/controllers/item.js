'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFilterItems = exports.getSameTypeItems = exports.getAllItems = exports.updateItem = exports.createNewItem = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var createNewItem = exports.createNewItem = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(owner, name, type, price) {
    var item;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            item = new _item2.default({ owner: owner, name: name, type: type, price: price });
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

var updateItem = exports.updateItem = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(owner, item, name, type, price, loc) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt('return', _item2.default.update({ _id: item._id }, { owner: owner, name: name, type: type, price: price, loc: loc }));

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function updateItem(_x5, _x6, _x7, _x8, _x9, _x10) {
    return _ref2.apply(this, arguments);
  };
}();

var getAllItems = exports.getAllItems = function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(userID, limit) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt('return', _item2.default.find({ owner: userID }).limit(limit));

          case 1:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function getAllItems(_x11, _x12) {
    return _ref3.apply(this, arguments);
  };
}();

var getSameTypeItems = exports.getSameTypeItems = function () {
  var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(type) {
    var items;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _item2.default.find({ type: type });

          case 2:
            items = _context4.sent;
            return _context4.abrupt('return', items);

          case 4:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function getSameTypeItems(_x13) {
    return _ref4.apply(this, arguments);
  };
}();

var getFilterItems = exports.getFilterItems = function () {
  var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(userID, limit, query) {
    var items;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (!isEmpty(query)) {
              _context5.next = 2;
              break;
            }

            return _context5.abrupt('return', null);

          case 2:
            _context5.next = 4;
            return _item2.default.find(_extends({ owner: userID }, query)).limit(limit);

          case 4:
            items = _context5.sent;
            return _context5.abrupt('return', items);

          case 6:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function getFilterItems(_x14, _x15, _x16) {
    return _ref5.apply(this, arguments);
  };
}();

exports.parseQuery = parseQuery;

var _item = require('../models/item');

var _item2 = _interopRequireDefault(_item);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function parseQuery(query) {
  var q = void 0;
  if (query.startsWith('name:')) {
    var name = query.replace('name:', '');
    q = {
      name: name
    };
  } else if (query.startsWith('type:')) {
    var type = query.replace('type:', '');
    q = {
      type: type
    };
  } else if (query.startsWith('time:')) {
    var time = query.replace('time:', '').split('~');
    q = {
      createdAt: {
        $gte: new Date(time[0]),
        $lt: new Date(time[1])
      }
    };
  }
  return q;
}