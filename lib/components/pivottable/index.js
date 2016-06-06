'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PivotTableComponent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _api = require('../../api');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var api = new _api.Api();

var PivotTableComponent = exports.PivotTableComponent = function (_events$EventEmitter) {
  _inherits(PivotTableComponent, _events$EventEmitter);

  function PivotTableComponent() {
    _classCallCheck(this, PivotTableComponent);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(PivotTableComponent).call(this));
  }

  _createClass(PivotTableComponent, [{
    key: 'getPivotData',
    value: function getPivotData(endpoint, cube, params) {
      var _this2 = this;

      params = _lodash2.default.cloneDeep(params);

      params.group = _lodash2.default.union(params.cols, params.rows);
      var cols = params.cols;
      var rows = params.rows;

      params.cols = undefined;
      params.rows = undefined;

      var that = this;

      this.emit('beginAggregate', this);
      var measures = {};
      var dimensions = [];

      return api.getDimensions(endpoint, cube).then(function (result) {
        dimensions = {};
        _lodash2.default.each(result, function (item) {
          dimensions[item.key] = item.code;
        });

        return api.getMeasures(endpoint, cube);
      }).then(function (result) {
        measures = {};
        _lodash2.default.each(result, function (item) {
          measures[item.key] = item.name;
        });

        params.page = 0;
        params.pagesize = 2000;

        return api.aggregate(endpoint, cube, params);
      }).then(function (data) {
        var result = {};
        result.data = [];

        result.rows = _lodash2.default.map(rows, function (row) {
          return dimensions[row];
        });
        result.cols = _lodash2.default.map(cols, function (col) {
          return dimensions[col];
        });

        _lodash2.default.each(data.cells, function (cell) {
          var item = {};
          _lodash2.default.each(params.group, function (key) {
            var dimension = _lodash2.default.find(cell.dimensions, { keyField: key });
            item[dimensions[key]] = dimension.nameValue;
          });
          var measure = _lodash2.default.find(cell.measures, { key: params.aggregates });
          item.value = measure.value;
          result.data.push(item);
        });

        _this2.emit('endAggregate', that, data);
        return result;
      });
    }
  }]);

  return PivotTableComponent;
}(_events2.default.EventEmitter);

exports.default = PivotTableComponent;