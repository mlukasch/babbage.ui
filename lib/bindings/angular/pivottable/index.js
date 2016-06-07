'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PivotTableDirective = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pivottable = require('../../../components/pivottable');

var _pivottable2 = _interopRequireDefault(_pivottable);

var _pivottable3 = require('pivottable');

var _pivottable4 = _interopRequireDefault(_pivottable3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PivotTableDirective = exports.PivotTableDirective = function () {
  function PivotTableDirective() {
    _classCallCheck(this, PivotTableDirective);
  }

  _createClass(PivotTableDirective, [{
    key: 'init',
    value: function init(angularModule) {
      angularModule.directive('pivotTable', ['$timeout', '$q', function ($timeout, $q) {
        return {
          restrict: 'EA',
          scope: {
            endpoint: '@',
            cube: '@',
            state: '='
          },
          template: "<div class=\"pivot-table\">\n</div>\n",
          replace: false,
          link: function link($scope, element) {
            var pivotTableComponent = new _pivottable2.default();
            var sum = $.pivotUtilities.aggregatorTemplates.sum;
            var numberFormat = $.pivotUtilities.numberFormat;
            var intFormat = numberFormat({ digitsAfterDecimal: 0 });

            var wrapper = element.find('.pivot-table')[0];
            pivotTableComponent.getPivotData($scope.endpoint, $scope.cube, $scope.state).then(function (result) {
              $(wrapper).pivot(result.data, {
                rows: result.rows,
                cols: result.cols,
                aggregator: sum(intFormat)(["value"])
              });
            });
          }
        };
      }]);
    }
  }]);

  return PivotTableDirective;
}();

exports.default = PivotTableDirective;