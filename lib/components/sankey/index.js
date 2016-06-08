'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SanKeyChartComponent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../../api/index');

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

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

var SanKeyChartComponent = exports.SanKeyChartComponent = function (_events$EventEmitter) {
  _inherits(SanKeyChartComponent, _events$EventEmitter);

  function SanKeyChartComponent() {
    _classCallCheck(this, SanKeyChartComponent);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SanKeyChartComponent).call(this));

    _this.wrapper = null;
    _this.sankey = null;
    return _this;
  }

  _createClass(SanKeyChartComponent, [{
    key: 'build',
    value: function build(endpoint, cube, params, wrapper, colorSchema) {
      var _this2 = this;

      var that = this;
      this.wrapper = wrapper;

      var unit = 15;
      var margin = { top: unit / 2, right: 1, bottom: 6, left: 1 };
      var svg = null;
      var group = null;

      var size = {
        width: this.wrapper.clientWidth,
        height: this.wrapper.clientWidth * 0.6
      };

      this.emit('beginAggregate', this);

      params.group = [params.source, params.target];
      sourceKey = params.source;
      targetKey = params.target;
      params.source = undefined;
      params.target = undefined;

      params.order = params.order || [{ key: params.aggregates, direction: 'desc' }, { key: params.source, direction: 'asc' }, { key: params.target, direction: 'asc' }];

      params.page = 0;
      params.pagesize = 2000;

      unit = Math.max(400, size.height) / 20;

      if (!svg) {
        svg = _d2.default.select(wrapper).append("svg");
        group = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      }

      api.aggregate(endpoint, cube, params).then(function (data) {

        size.height = data.cells.length * unit;
        svg.attr("height", size.height + margin.top + margin.bottom);
        svg.attr("width", size.width);

        var graph = {
          nodes: [],
          links: []
        };
        var objs = {};

        var targetScale = _d2.default.scale.ordinal().range(['#ddd', '#ccc', '#eee', '#bbb']);

        _lodash2.default.each(data.cells, function (cell) {
          var source = _lodash2.default.find(cell.dimensions, { keyField: sourceKey });
          var target = _lodash2.default.find(cell.dimensions, { keyField: targetKey });
          var measure = _lodash2.default.find(cell.measures, { key: params.aggregates });

          var sourceId = source.keyValue;
          var targetId = target.keyValue;

          var link = {
            value: measure.value,
            number: _d2.default.format("0,000")(measure.value)
          };

          if (link.value == 0 || !sourceId || !targetId) {
            return;
          }
          sourceId = 'source-' + sourceKey + sourceId;
          targetId = 'target-' + targetKey + targetId;

          if (!objs[sourceId]) {
            graph.nodes.push({
              name: source.nameValue,
              color: Utils.colorScale(sourceId)
            });
            objs[sourceId] = { idx: graph.nodes.length - 1 };
          }
          link.source = objs[sourceId].idx;

          if (!objs[targetId]) {
            graph.nodes.push({
              name: target.nameValue,
              color: targetScale(targetId)
            });
            objs[targetId] = {
              idx: graph.nodes.length - 1
            };
          }
          link.target = objs[targetId].idx;
          graph.links.push(link);
        });

        _this2.sankey = sankey = _d2.default.sankey().nodeWidth(unit).nodePadding(unit * 0.6).size([size.width, size.height]);

        var path = sankey.link();

        sankey.nodes(graph.nodes).links(graph.links).layout(32);

        group.selectAll('g').remove();

        var link = group.append("g").selectAll(".link").data(graph.links).enter().append("path").attr("class", "link").attr("d", path).style("stroke-width", function (d) {
          return Math.max(1, d.dy);
        }).style("stroke", function (d) {
          return d.source.color;
        }).sort(function (a, b) {
          return b.dy - a.dy;
        });

        link.append("title").text(function (d) {
          return d.source.name + " → " + d.target.name + "\n" + d.number;
        });

        var node = group.append("g").selectAll(".node").data(graph.nodes).enter().append("g").attr("class", "node").attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
        });

        node.append("rect").attr("height", function (d) {
          return d.dy;
        }).attr("width", sankey.nodeWidth()).style("fill", function (d) {
          return d.color;
        }).style("stroke", function (d) {
          return d.color;
        }).append("title").text(function (d) {
          return d.name;
        });

        node.append("text").attr("x", -6).attr("y", function (d) {
          return d.dy / 2;
        }).attr("dy", ".35em").attr("text-anchor", "end").attr("transform", null).text(function (d) {
          return d.name;
        }).filter(function (d) {
          return d.x < size.width / 2;
        }).attr("x", 6 + sankey.nodeWidth()).attr("text-anchor", "start");

        _this2.emit('endAggregate', that, data);
      });
    }
  }]);

  return SanKeyChartComponent;
}(_events2.default.EventEmitter);

exports.default = SanKeyChartComponent;