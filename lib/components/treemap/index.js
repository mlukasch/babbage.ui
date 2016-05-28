'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TreeMapComponent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _api = require('../../api');

var _c = require('c3');

var _c2 = _interopRequireDefault(_c);

var _utils = require('../utils.js');

var Utils = _interopRequireWildcard(_utils);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _utils2 = require('./utils.js');

var TreemapUtils = _interopRequireWildcard(_utils2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var api = new _api.Api();

function positionNode() {
  this.style("left", function (d) {
    return d.x + "px";
  }).style("top", function (d) {
    return d.y + "px";
  }).style("width", function (d) {
    return Math.max(0, d.dx - 1) + "px";
  }).style("height", function (d) {
    return Math.max(0, d.dy - 1) + "px";
  });
};

var TreeMapComponent = exports.TreeMapComponent = function (_events$EventEmitter) {
  _inherits(TreeMapComponent, _events$EventEmitter);

  function TreeMapComponent() {
    _classCallCheck(this, TreeMapComponent);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TreeMapComponent).call(this));

    _this.wrapper = null;
    _this.treemap = null;
    return _this;
  }

  _createClass(TreeMapComponent, [{
    key: 'build',
    value: function build(endpoint, cube, params, wrapper, colorSchema) {
      params = _lodash2.default.cloneDeep(params);
      var that = this;

      this.wrapper = wrapper;
      var size = {
        width: this.wrapper.clientWidth,
        height: this.wrapper.clientWidth * 0.6
      };

      this.emit('beginAggregate', this);

      this.treemap = d3.layout.treemap().size([size.width, size.height]).sticky(true).sort(function (a, b) {
        return a['_value'] - b['_value'];
      }).value(function (d) {
        return d['_value'];
      });

      d3.select(wrapper).select("div").remove();
      var div = d3.select(wrapper).append("div").style("position", "relative").style("width", size.width + "px").style("height", size.height + "px");

      api.aggregate(endpoint, cube, params).then(function (data) {
        var root = {
          children: [],
          summary: data.summary[params.aggregates],
          summary_fmt: Utils.numberFormat(data.summary[params.aggregates])
        };

        for (var i in data.cells) {
          var dimension = _lodash2.default.first(data.cells[i].dimensions);
          var measure = _lodash2.default.find(data.cells[i].measures, { key: params.aggregates });
          var cell = {};
          cell._area_fmt = Utils.numberFormat(Math.round(measure.value));
          cell._value = measure.value;
          cell._key = dimension.keyValue;
          cell._name = dimension.nameValue;
          cell._color = Utils.colorScale(i, colorSchema);

          cell._percentage = measure.value && data.summary && params.aggregates ? measure.value / Math.max(data.summary[params.aggregates], 1) : 1;
          root.children.push(cell);
        }

        that.emit('dataLoaded', that, root);

        var node = div.datum(root).selectAll(".node").data(that.treemap.nodes).enter().append("a").attr("href", function (d) {
          return d.href;
        }).attr("class", "node").call(positionNode).style("background", '#fff').html(function (d) {
          if (d._percentage < 0.02) {
            return '';
          }
          return d.children ? null : '<span class="amount">' + d._area_fmt + '</span>' + d._name;
        }).on("click", function (d) {
          that.emit('click', that, d);
        }).on("mouseover", function (d) {
          d3.select(this).transition().duration(200).style({ 'background': d3.rgb(d._color).darker() });
        }).on("mouseout", function (d) {
          d3.select(this).transition().duration(500).style({ 'background': d._color });
        }).transition().duration(500).delay(function (d, i) {
          return Math.min(i * 30, 1500);
        }).style("background", function (d) {
          return d._color;
        });

        // Check & Remove all rectangles with text overlfow:
        var boxContentRemover = function boxContentRemover(item) {
          return $(item).empty();
        };
        var hasTextOverflow = TreemapUtils.checkForTextOverflow("a.node", boxContentRemover);
        if (hasTextOverflow) {
          that.emit('textOverflow', that);
        };
        that.emit('endAggregate', that, data);
      });
    }
  }]);

  return TreeMapComponent;
}(_events2.default.EventEmitter);

exports.default = TreeMapComponent;