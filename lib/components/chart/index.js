'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartComponent = undefined;

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

var ChartComponent = exports.ChartComponent = function (_events$EventEmitter) {
  _inherits(ChartComponent, _events$EventEmitter);

  function ChartComponent() {
    _classCallCheck(this, ChartComponent);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ChartComponent).call(this));

    _this.wrapper = null;
    _this.chart = null;
    return _this;
  }

  _createClass(ChartComponent, [{
    key: 'build',
    value: function build(chartType, endpoint, cube, params, wrapper, colorSchema) {
      var _this2 = this;

      params = _lodash2.default.cloneDeep(params);

      var that = this;
      this.wrapper = wrapper;

      this.emit('beginAggregate', this);

      if (chartType == 'line') {
        params.order = params.order || [{ key: _lodash2.default.first(params.group), direction: ':asc' }];
      }

      var series;
      var groupFields = _lodash2.default.first(params.group);
      if (params.series) {
        params.group = _lodash2.default.union(params.group, params.series);
        series = _lodash2.default.first(params.series);
        params.series = undefined;
        params.order = params.order || [{ key: series, direction: 'asc' }, { key: params.aggregates, direction: 'desc' }];
      }

      if (series && chartType == 'line') {
        chartType = 'area';
      }

      params.page = 0;
      params.pagesize = 2000;

      api.aggregate(endpoint, cube, params).then(function (data) {

        var columns = Utils.buildC3Columns(data, groupFields, series, params.aggregates);
        var types = {};
        var c3Groups = _lodash2.default.map(_lodash2.default.slice(columns, 1), function (column) {
          return column[0];
        });
        _lodash2.default.each(_lodash2.default.slice(columns, 1), function (column) {
          types[column[0]] = chartType;
        });

        that.chart = _c2.default.generate({
          bindto: that.wrapper,
          data: {
            names: Utils.buildC3BarNames(data, params.aggregates),
            columns: columns,
            color: function color(_color, d) {
              var c = d.id || d;
              if (chartType == 'bar' && !series) {
                c = d.index;
              };
              return Utils.colorScale(c);
            },
            type: chartType || 'bar',
            x: _lodash2.default.first(_lodash2.default.first(columns)),
            groups: [c3Groups],
            types: types
          },
          point: {
            show: false
          },
          grid: {
            focus: {
              show: false
            }
          },
          axis: {
            x: {
              type: 'category',
              tick: {
                culling: true,
                fit: true
              }
            },
            y: {
              tick: {
                format: d3.format("0,000"),
                culling: true,
                fit: true
              },
              lines: [{ value: 0 }]
            }
          }
        });

        _this2.emit('endAggregate', that, data);
      });
    }
  }]);

  return ChartComponent;
}(_events2.default.EventEmitter);

exports.default = ChartComponent;