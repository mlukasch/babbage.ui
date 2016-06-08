'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TableComponent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../../api/index');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var api = new _index.Api();

var TableComponent = exports.TableComponent = function (_events$EventEmitter) {
  _inherits(TableComponent, _events$EventEmitter);

  function TableComponent() {
    _classCallCheck(this, TableComponent);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(TableComponent).call(this));
  }

  _createClass(TableComponent, [{
    key: 'showKeys',
    value: function showKeys(items) {
      var result = false;
      _lodash2.default.each(items, function (item) {
        result = result || item.name != item.key;
      });
      return result;
    }
  }, {
    key: 'getHeaders',
    value: function getHeaders(dimensions, measures, cells) {
      var result = [];
      var rows = [];
      var cell = _lodash2.default.first(cells);

      _lodash2.default.each(cell.dimensions, function (dimension) {
        var dimensionData = _lodash2.default.find(dimensions, { key: dimension.keyField });
        rows.push(dimensionData.code || dimensionData.name);
      });

      _lodash2.default.each(cell.measures, function (measure) {
        var measureInfo = _lodash2.default.find(measures, { key: measure.key });
        rows.push(measureInfo.name || measureInfo.value);
      });

      result.push(rows);

      return result;
    }
  }, {
    key: 'getTableData',
    value: function getTableData(endpoint, cube, params) {
      var _this2 = this;

      params = _lodash2.default.cloneDeep(params);
      var result = {
        headers: [],
        columns: []
      };

      var that = this;

      this.emit('beginAggregate', this);
      var measures = {};
      var dimensions = [];

      return api.getDimensions(endpoint, cube).then(function (result) {
        dimensions = result;

        return api.getMeasures(endpoint, cube);
      }).then(function (result) {
        measures = result;

        return api.aggregate(endpoint, cube, params);
      }).then(function (data) {
        result.headers = that.getHeaders(dimensions, measures, data.cells);
        result.columns = data.cells;
        _this2.emit('endAggregate', that, data);

        return result;
      });
    }
  }]);

  return TableComponent;
}(_events2.default.EventEmitter);

exports.default = TableComponent;