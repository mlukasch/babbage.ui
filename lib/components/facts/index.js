'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FactsComponent = undefined;

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

var FactsComponent = exports.FactsComponent = function (_events$EventEmitter) {
  _inherits(FactsComponent, _events$EventEmitter);

  function FactsComponent() {
    _classCallCheck(this, FactsComponent);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(FactsComponent).call(this));
  }

  _createClass(FactsComponent, [{
    key: 'getTableData',
    value: function getTableData(endpoint, cube, params) {
      var _this2 = this;

      params = _lodash2.default.cloneDeep(params);
      var that = this;

      this.emit('beginFacts', this);
      return api.facts(endpoint, cube, params).then(function (data) {
        _this2.emit('endFacts', that, data);
        return data;
      });
    }
  }]);

  return FactsComponent;
}(_events2.default.EventEmitter);

exports.default = FactsComponent;