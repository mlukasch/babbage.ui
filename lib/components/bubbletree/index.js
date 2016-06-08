'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BubbleTreeComponent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../../api/index');

var _c = require('c3');

var _c2 = _interopRequireDefault(_c);

var _utils = require('../utils.js');

var Utils = _interopRequireWildcard(_utils);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _bubbletree = require('bubbletree');

var _bubbletree2 = _interopRequireDefault(_bubbletree);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

window.BubbleTree = _bubbletree2.default;
var api = new _index.Api();

var BubbleTreeComponent = exports.BubbleTreeComponent = function (_events$EventEmitter) {
  _inherits(BubbleTreeComponent, _events$EventEmitter);

  function BubbleTreeComponent() {
    _classCallCheck(this, BubbleTreeComponent);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BubbleTreeComponent).call(this));

    _this.wrapper = null;
    _this.bubbleTree = null;
    return _this;
  }

  _createClass(BubbleTreeComponent, [{
    key: 'generateBubbuleTreeData',
    value: function generateBubbuleTreeData(cells, params) {
      var children = [];
      _lodash2.default.each(cells, function (cell) {
        var dimension = _lodash2.default.first(cell.dimensions);
        var measure = _lodash2.default.find(cell.measures, { key: params.aggregates });
        children.push({
          label: dimension.nameValue,
          amount: measure.value
        });
      });
      return {
        label: 'Total',
        amount: _lodash2.default.reduce(children, function (result, item) {
          return result + item.amount;
        }, 0),
        children: children
      };
    }
  }, {
    key: 'build',
    value: function build(endpoint, cube, params, wrapper, colorSchema) {
      var _this2 = this;

      var that = this;
      this.wrapper = wrapper;

      this.emit('beginAggregate', this);

      api.aggregate(endpoint, cube, params).then(function (data) {
        var bubbleTreeData = _this2.generateBubbuleTreeData(data.cells, params);

        that.bubbleTree = new _bubbletree2.default({
          autoColors: true,
          data: bubbleTreeData,
          container: wrapper,
          nodeClickCallback: function nodeClickCallback(node) {
            if (node.level > 0) {
              that.emit('click', that, node);
            }
          }
        });

        _this2.emit('endAggregate', that, data);
      });
    }
  }]);

  return BubbleTreeComponent;
}(_events2.default.EventEmitter);

exports.default = BubbleTreeComponent;