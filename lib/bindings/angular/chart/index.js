'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartDirective = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chart = require('../../../components/chart');

var _chart2 = _interopRequireDefault(_chart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChartDirective = exports.ChartDirective = function () {
  function ChartDirective() {
    _classCallCheck(this, ChartDirective);
  }

  _createClass(ChartDirective, [{
    key: 'init',
    value: function init(angularModule) {
      angularModule.directive('chart', ['$window', function ($window) {
        return {
          restrict: 'EA',
          scope: {
            endpoint: '@',
            cube: '@',
            type: '@',
            state: '='
          },
          template: "<div class=\"table-babbage\" ng-hide=\"queryLoaded\">\n  <div class=\"alert alert-info\">\n    <strong>You have not selected any data.</strong> Please choose the\n    configuration for your chart.\n  </div>\n</div>\n\n<div class=\"alert alert-warning\" ng-show=\"cutoffWarning\">\n  <strong>Too many categories.</strong> There are more than {{cutoff}} items\n  in the selected drilldown.\n</div>\n\n<div class=\"chart-babbage\"><svg></svg></div>\n",
          replace: false,
          link: function link($scope, element) {
            var chart = new _chart2.default();
            var wrapper = element.find('.chart-babbage')[0];

            chart.build($scope.type, $scope.endpoint, $scope.cube, $scope.state, wrapper);

            $scope.cutoffWarning = false;
            $scope.queryLoaded = true;
          }
        };
      }]);
    }
  }]);

  return ChartDirective;
}();

exports.default = ChartDirective;