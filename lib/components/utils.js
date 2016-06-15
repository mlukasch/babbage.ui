'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numberFormat = undefined;
exports.colorScale = colorScale;
exports.buildC3Names = buildC3Names;
exports.buildC3BarNames = buildC3BarNames;
exports.buildC3PieColumns = buildC3PieColumns;
exports.buildC3Columns = buildC3Columns;
exports.buildC3BarColumns = buildC3BarColumns;
exports.buildC3Colors = buildC3Colors;
exports.buildC3BarColors = buildC3BarColors;
exports.moneyFormat = moneyFormat;

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultColorSchema = ["#CF3D1E", "#F15623", "#F68B1F", "#FFC60B", "#DFCE21", "#BCD631", "#95C93D", "#48B85C", "#00833D", "#00B48D", "#60C4B1", "#27C4F4", "#478DCB", "#3E67B1", "#4251A3", "#59449B", "#6E3F7C", "#6A246D", "#8A4873", "#EB0080", "#EF58A0", "#C05A89"];

var scale = _d2.default.scale.ordinal();

var numberFormat = exports.numberFormat = _d2.default.format("0,000");

function colorScale(index, colorSchema) {
  scale.range(_lodash2.default.isArray(colorSchema) || defaultColorSchema);

  return scale(index);
};

function buildC3Names(data) {
  var result = {};
  _lodash2.default.each(data.cells, function (item) {
    var dimension = _lodash2.default.first(item.dimensions);
    result[dimension.keyValue] = dimension.nameValue;
  });
  return result;
};

function buildC3BarNames(data, aggregates) {
  var result = {};
  _lodash2.default.each(data.cells, function (item) {
    var dimension = _lodash2.default.first(item.dimensions);
    if (_lodash2.default.values(result).length == 0) {
      var measure = _lodash2.default.find(item.measures, { key: aggregates });
      result[measure.key] = _lodash2.default.first(measure.key.split('.'));
    }
    result[dimension.keyValue] = dimension.nameValue;
  });
  return result;
};

function buildC3PieColumns(data, aggregates) {
  var result = _lodash2.default.map(data.cells, function (item) {
    var dimension = _lodash2.default.first(item.dimensions);
    var measure = _lodash2.default.find(item.measures, { key: aggregates });
    return [dimension.keyValue, measure.value];
  });
  return result;
};

function buildC3Columns(data, xDimensionField, seriesDimensionField, aggregates) {

  var columns = [[xDimensionField]],
      series = { xDimensionField: 0 };

  for (var i in data.cells) {
    var seriesDimension;
    var item = data.cells[i];
    var xDimension = _lodash2.default.find(item.dimensions, { keyField: xDimensionField });
    if (seriesDimensionField) {
      seriesDimension = _lodash2.default.find(item.dimensions, { keyField: seriesDimensionField });
    }

    var measure = _lodash2.default.find(item.measures, { key: aggregates });
    var field = seriesDimensionField ? seriesDimension.nameValue : measure.name;

    if (!series[field]) {
      series[field] = columns.push([field]) - 1;
    }
    if (columns[0].indexOf(xDimension.nameValue) < 1) {
      columns[0].push(xDimension.nameValue);
    }
    var index = columns[0].indexOf(xDimension.nameValue);
    columns[series[field]][index] = measure.value;
  }
  var maxLength = Math.max.apply(null, columns.map(function (r) {
    return r.length;
  }));
  for (var i = 1; i < maxLength; i++) {
    for (var j in columns) {
      columns[j][i] = columns[j][i] || 0;
    }
  }
  return columns;
};

function buildC3BarColumns(data, aggregates) {
  var result = [];
  var list = [];
  _lodash2.default.each(data.cells, function (item) {
    var dimension = _lodash2.default.first(item.dimensions);
    if (list.length == 0) {
      list.push(dimension.keyField);
    }
    list.push(dimension.nameValue);
  });
  result.push(list);
  list = [];

  _lodash2.default.each(data.cells, function (item) {
    var measures = _lodash2.default.find(item.measures, { key: aggregates });

    if (list.length == 0) {
      list.push(measures.key);
    }
    list.push(measures.value);
  });
  result.push(list);

  return result;
};

function buildC3Colors(data, colorSchema) {
  var result = _lodash2.default.map(data.cells, function (item, index) {
    var dimension = _lodash2.default.first(item.dimensions);
    return [dimension.keyValue, colorScale(index, colorSchema)];
  });
  return result;
};

function buildC3BarColors(data, colorSchema) {
  var result = _lodash2.default.map(data.cells, function (item, index) {
    var dimension = _lodash2.default.first(item.dimensions);
    return [dimension.keyValue, colorScale(index, colorSchema)];
  });
  return result;
};

function moneyFormat(amount, currency) {
  if (amount && currency) {
    var currency_symbol = { USD: "$", GBP: "£", EUR: "€", JPY: "¥" }[currency];
    var amount_fmt = currency_symbol ? currency_symbol + amount : amount + " " + currency;
    return amount_fmt ? amount_fmt : "";
  } else {
    return amount ? amount : "";
  }
};