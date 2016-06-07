'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PieChartDirective = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pie = require('../../../components/pie');

var _pie2 = _interopRequireDefault(_pie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PieChartDirective = exports.PieChartDirective = function () {
  function PieChartDirective() {
    _classCallCheck(this, PieChartDirective);
  }

  _createClass(PieChartDirective, [{
    key: 'init',
    value: function init(angularModule) {
      angularModule.directive('pieChart', ['$window', function ($window) {
        return {
          restrict: 'EA',
          scope: {
            endpoint: '@',
            cube: '@',
            state: '='
          },
          template: "<div class=\"table-babbage\" ng-hide=\"queryLoaded\">\n  <div class=\"alert alert-info\">\n    <strong>You have not selected any data.</strong> Please choose the\n    configuration for your chart.\n  </div>\n</div>\n\n<div class=\"alert alert-warning\" ng-show=\"cutoffWarning\">\n  <strong>Too many categories.</strong> There are more than {{cutoff}} items\n  in the selected drilldown.\n</div>\n\n<div class=\"pie-chart\"></div>\n",
          replace: false,
          link: function link($scope, element) {
            var pieChart = new _pie2.default();
            var wrapper = element.find('.pie-chart')[0];

            pieChart.build($scope.endpoint, $scope.cube, $scope.state, wrapper);

            $scope.cutoffWarning = false;
            $scope.queryLoaded = true;
          }
        };
      }]);
    }
  }]);

  return PieChartDirective;
}();

exports.default = PieChartDirective;