'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Api = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('isomorphic-fetch');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Api = exports.Api = function () {
  function Api() {
    _classCallCheck(this, Api);

    this.cache = {};
  }

  _createClass(Api, [{
    key: 'get',
    value: function get(url) {
      var that = this;
      if (this.cache[url]) {
        return _bluebird2.default.resolve(this.cache[url]);
      } else {
        return fetch(url).then(function (response) {
          return response.text();
        }).then(function (text) {
          return that.cache[url] = text;
        });
      }
    }
  }, {
    key: 'getJson',
    value: function getJson(url) {
      return this.get(url).then(JSON.parse);
    }
  }, {
    key: 'flush',
    value: function flush() {
      this.cache = {};
    }
  }, {
    key: 'transformParams',
    value: function transformParams(params) {
      var result = {};
      result.drilldown = params.group;
      result.aggregates = params.aggregates;
      result.pagesize = params.pagesize;
      result.cut = params.filter;
      result.page = params.page;
      result.order = params.order;

      return _lodash2.default.pickBy(result);
    }
  }, {
    key: 'buildUrl',
    value: function buildUrl(endpoint, cube, path, originParams) {
      var params = _lodash2.default.cloneDeep(originParams) || {};
      var api = endpoint;
      api = endpoint[api.length - 1] == '/' ? api.slice(0, api.length - 1) : api;
      api = api + '/cubes/' + cube + '/' + path;
      var urlObj = _url2.default.parse(api);

      if (urlObj.query) {
        params = _lodash2.default.assign(_querystring2.default.parse(urlObj.jquery), params);
      }
      _lodash2.default.each(params, function (value, key) {
        if (_lodash2.default.isArray(value)) {
          if (key == 'order') {
            params[key] = _lodash2.default.map(value, function (item) {
              return item.key + ':' + item.direction;
            }).join(',');
          } else {
            params[key] = value.join('|');
          }
        }
      });

      urlObj.search = _querystring2.default.stringify(this.transformParams(params));

      return _url2.default.format(urlObj);
    }
  }, {
    key: 'getDimensionMembers',
    value: function getDimensionMembers(endpoint, cube, dimension) {
      return this.getJson(this.buildUrl(endpoint, cube, 'members/' + dimension));
    }
  }, {
    key: 'getPackageModel',
    value: function getPackageModel(endpoint, cube) {
      return this.getJson(this.buildUrl(endpoint, cube, 'model')).then(function (result) {
        return result.model;
      });
    }
  }, {
    key: 'getDisplayField',
    value: function getDisplayField(model, field) {
      var result = field;
      var dimension = _lodash2.default.find(model.dimensions, { key_ref: field });

      if (dimension) {
        result = dimension.label_ref;
      }

      return result;
    }
  }, {
    key: 'getMeasuresFromModel',
    value: function getMeasuresFromModel(model) {
      var result = [];
      _lodash2.default.each(model.aggregates, function (value, key) {
        if (value.measure) {
          result.push({
            key: key,
            value: value.label
          });
        }
      });
      return result;
    }
  }, {
    key: 'getMeasures',
    value: function getMeasures(endpoint, cube) {
      var that = this;
      return this.getPackageModel(endpoint, cube).then(function (model) {
        return that.getMeasuresFromModel(model);
      });
    }
  }, {
    key: 'getDimensions',
    value: function getDimensions(endpoint, cube) {
      var that = this;
      return this.getPackageModel(endpoint, cube).then(function (model) {
        return that.getDimensionsFromModel(model);
      });
    }
  }, {
    key: 'getDimensionKeyById',
    value: function getDimensionKeyById(model, id) {
      return model.dimensions[id].key_ref;
    }
  }, {
    key: 'getDrillDownDimensionKey',
    value: function getDrillDownDimensionKey(model, dimensionId) {
      var result = undefined;
      var dimension = model.dimensions[dimensionId];
      var hierarchy = model.hierarchies[dimension.hierarchy];
      if (hierarchy) {
        var dimensionLevel = hierarchy.levels.indexOf(dimensionId);
        if (dimensionLevel > -1) {
          var drillDownDimensionId = hierarchy.levels[dimensionLevel + 1];
          if (drillDownDimensionId) {
            result = this.getDimensionKeyById(model, drillDownDimensionId);
          }
        }
      }
      return result;
    }
  }, {
    key: 'getDimensionsFromModel',
    value: function getDimensionsFromModel(model) {
      var that = this;
      var result = [];
      _lodash2.default.each(model.dimensions, function (value, id) {

        // jscs:disable
        var keyAttribute = value.key_attribute;
        var labelAttribute = value.label_attribute;
        // jscs:enable

        result.push({
          id: id,
          key: that.getDimensionKeyById(model, id),
          code: value.label,
          hierarchy: value.hierarchy,
          name: value.attributes[keyAttribute].column,
          label: value.hierarchy + '.' + labelAttribute,
          drillDown: that.getDrillDownDimensionKey(model, id)
        });
      });

      return _lodash2.default.sortBy(result, function (value) {
        return value.key;
      });
    }
  }, {
    key: 'getSimpleLabel',
    value: function getSimpleLabel(key) {
      var parts = key.split('.');
      return parts.length == 2 ? parts[1] : key;
    }
  }, {
    key: 'facts',
    value: function facts(endpoint, cube, originParams) {
      var that = this;
      var params = _lodash2.default.cloneDeep(originParams) || {};
      var measureFields = [];
      params.page = params.page || 0;
      params.pagesize = params.pagesize || 20;
      var model;

      return this.getPackageModel(endpoint, cube).then(function (_model) {
        model = _model;
        var dimensions = that.getDimensionsFromModel(model);
        var measures = that.getMeasuresFromModel(model);
        if (!originParams.fields) {
          originParams.fields = [];
          _lodash2.default.each(dimensions, function (dimension) {
            originParams.fields.push(dimension.key);
          });
          _lodash2.default.each(measures, function (measure) {
            originParams.fields.push(measure.value);
          });
        }
        _lodash2.default.each(model.measures, function (measure, key) {
          measureFields.push(key);
        });

        var factsUrl = that.buildUrl(endpoint, cube, 'facts', params);
        return that.getJson(factsUrl);
      }).then(function (facts) {
        var result = {};
        result.headers = [];
        result.columns = [];
        result.info = {};
        result.info.total = facts.total_fact_count;
        result.info.pageSize = facts.page_size;
        result.info.page = facts.page;
        _lodash2.default.each(facts.fields, function (field) {
          var fieldParts = field.split('.');
          var conceptKey = fieldParts[0];
          var attribute = fieldParts[1];
          var concept = model.dimensions[conceptKey] || model.measures[conceptKey];
          if (attribute && concept.attributes) {
            concept = concept.attributes[attribute];
          }

          result.headers.push({
            key: field,
            label: concept.label,
            numeric: measureFields.indexOf(field) > -1
          });
        });

        _lodash2.default.each(facts.data, function (raw) {
          var column = [];
          _lodash2.default.each(result.headers, function (header) {
            column.push(raw[header.key]);
          });
          result.columns.push(column);
        });
        return result;
      });
    }
  }, {
    key: 'aggregate',
    value: function aggregate(endpoint, cube, originParams) {
      var that = this;
      var params = _lodash2.default.cloneDeep(originParams) || {};

      params.page = params.page || 0;
      params.pagesize = params.pagesize || 30;
      var dimensions = [];
      var measures = [];
      var model = null;

      return this.getPackageModel(endpoint, cube).then(function (model) {
        measures = that.getMeasuresFromModel(model);
        that.model = model;

        if (!params.aggregates) {
          params.aggregates = _lodash2.default.first(measures).key;
        }
        params.order = params.order || [{ key: params.aggregates, direction: 'desc' }];
        params.aggregates = undefined; //remove it

        var newExtendedGroup = [];
        _lodash2.default.each(params.group, function (dimensionKey) {
          newExtendedGroup.push(dimensionKey);
          var dimensionDisplay = that.getDisplayField(model, dimensionKey);

          dimensions.push({
            key: dimensionKey,
            name: dimensionDisplay
          });

          if (newExtendedGroup.indexOf(dimensionDisplay) == -1) {
            newExtendedGroup.push(dimensionDisplay);
          }
        });
        params.group = newExtendedGroup;

        var aggregateUrl = that.buildUrl(endpoint, cube, 'aggregate', params);

        return that.getJson(aggregateUrl);
      }).then(function (data) {

        var result = {
          summary: {},
          count: data.total_cell_count,
          cells: []
        };

        _lodash2.default.each(measures, function (measure) {
          result.summary[measure.key] = data.summary ? data.summary[measure.key] : undefined;
          var measureModel = that.model.measures[measure.value];
          result.summary["currency"] = measureModel ? measureModel.currency : "";
        });

        _lodash2.default.each(data.cells, function (cell) {
          var dimensionsResult = [];
          var measuresResult = [];

          _lodash2.default.each(dimensions, function (dimension) {
            dimensionsResult.push({
              keyField: dimension.key,
              nameField: dimension.name,
              keyValue: cell[dimension.key],
              nameValue: cell[dimension.name]
            });
          });

          _lodash2.default.each(measures, function (measure) {
            measuresResult.push({
              key: measure.key,
              name: measure.value,
              value: cell[measure.key]
            });
          });

          result.cells.push({
            dimensions: dimensionsResult,
            measures: measuresResult
          });
        });
        return result;
      });
    }
  }, {
    key: 'loadGeoJson',
    value: function loadGeoJson(cosmopolitanApiUrl, countryCode) {
      var url = cosmopolitanApiUrl + 'polygons/country:' + encodeURIComponent(countryCode) + '?format=json';

      return this.getJson(url).then(function (jsonData) {
        return jsonData.polygon;
      });
    }
  }]);

  return Api;
}();

exports.default = Api;