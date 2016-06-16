'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PieChartComponent = undefined;

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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var api = new _index.Api();

var PieChartComponent = exports.PieChartComponent = function (_events$EventEmitter) {
  _inherits(PieChartComponent, _events$EventEmitter);

  function PieChartComponent() {
    _classCallCheck(this, PieChartComponent);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PieChartComponent).call(this));

    _this.wrapper = null;
    _this.chart = null;
    return _this;
  }

  _createClass(PieChartComponent, [{
    key: 'build',
    value: function build(endpoint, cube, params, wrapper, colorSchema) {
      var _this2 = this;

      params = _lodash2.default.cloneDeep(params);

      var that = this;
      this.wrapper = wrapper;

      this.emit('beginAggregate', this);

      api.aggregate(endpoint, cube, params).then(function (data) {

        var columns = Utils.buildC3PieColumns(data, params.aggregates);
        var colors = {};
        _lodash2.default.each(columns, function (value, index) {
          colors[value[0]] = Utils.colorScale(index);
        });

        that.chart = _c2.default.generate({
          bindto: that.wrapper,
          data: {
            names: Utils.buildC3Names(data),
            columns: columns,
            colors: colors,
            type: 'pie',
            onclick: function onclick(d, element) {
              that.emit('click', that, d);
            }
          }
        });

        _this2.emit('endAggregate', that, data);
      });
    }
  }]);

  return PieChartComponent;
}(_events2.default.EventEmitter);

exports.default = PieChartComponent;