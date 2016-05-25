'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SanKeyChartDirective = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sankey = require('../../../components/sankey');

var _sankey2 = _interopRequireDefault(_sankey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SanKeyChartDirective = exports.SanKeyChartDirective = function () {
  function SanKeyChartDirective() {
    _classCallCheck(this, SanKeyChartDirective);
  }

  _createClass(SanKeyChartDirective, [{
    key: 'init',
    value: function init(angularModule) {
      angularModule.directive('sanKeyChart', ['$window', function ($window) {
        return {
          restrict: 'EA',
          scope: {
            endpoint: '@',
            cube: '@',
            state: '='
          },
          template: "<div class=\"table-babbage\" ng-hide=\"queryLoaded\">\n  <div class=\"alert alert-info\">\n    <strong>You have not selected any data.</strong> Please choose the\n    configuration for your chart.\n  </div>\n</div>\n\n<div class=\"alert alert-warning\" ng-show=\"cutoffWarning\">\n  <strong>Too many categories.</strong> There are more than {{cutoff}} items\n  in the selected drilldown.\n</div>\n\n<div class=\"sankey-chart\"></div>\n",
          replace: false,
          link: function link($scope, element) {
            var sanKeyChart = new _sankey2.default();
            var wrapper = element.find('.sankey-chart')[0];

            sanKeyChart.build($scope.endpoint, $scope.cube, $scope.state, wrapper);
          }
        };
      }]);
    }
  }]);

  return SanKeyChartDirective;
}();

exports.default = SanKeyChartDirective;