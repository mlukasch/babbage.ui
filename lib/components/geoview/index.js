'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GeoViewComponent = undefined;

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

var GeoViewComponent = exports.GeoViewComponent = function (_events$EventEmitter) {
  _inherits(GeoViewComponent, _events$EventEmitter);

  function GeoViewComponent() {
    _classCallCheck(this, GeoViewComponent);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(GeoViewComponent).call(this));
  }

  _createClass(GeoViewComponent, [{
    key: 'getGeoMapData',
    value: function getGeoMapData(endpoint, cube, params) {
      var _this2 = this;

      params = _lodash2.default.cloneDeep(params);
      var result = {};

      var that = this;

      this.emit('beginAggregate', this);

      return api.aggregate(endpoint, cube, params).then(function (data) {
        _lodash2.default.each(data.cells, function (cell) {
          var dimension = _lodash2.default.first(cell.dimensions);
          var measure = _lodash2.default.find(cell.measures, { key: params.aggregates });
          var nameValue = dimension.nameValue.replace(/^[-0-9 .]+/, ''); //TODO: Remove when not necessary
          result[nameValue] = measure.value;
        });

        _this2.emit('endAggregate', that, data);
        return result;
      });
    }
  }]);

  return GeoViewComponent;
}(_events2.default.EventEmitter);

exports.default = GeoViewComponent;