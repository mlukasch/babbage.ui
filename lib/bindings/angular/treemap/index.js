'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _treemap = require('../../../components/treemap');

var _treemap2 = _interopRequireDefault(_treemap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TreemapDirective = function () {
  function TreemapDirective() {
    _classCallCheck(this, TreemapDirective);
  }

  _createClass(TreemapDirective, [{
    key: 'init',
    value: function init(angularModule) {
      angularModule.directive('treeMap', ['$window', function ($window) {
        return {
          restrict: 'EA',
          scope: {
            endpoint: '@',
            cube: '@',
            state: '='
          },
          template: "<div class=\"table-babbage\" ng-hide=\"queryLoaded\">\n  <div class=\"alert alert-info\">\n    <strong>You have not selected any data.</strong> Please choose a breakdown for\n    your treemap.\n  </div>\n</div>\n\n<div class=\"alert alert-warning\" ng-show=\"cutoffWarning\">\n  <strong>Too many tiles.</strong> The breakdown you have selected contains many\n  different categories, only the {{cutoff}} biggest are shown.\n</div>\n\n<div class=\"treemap-chart\"></div>\n",
          replace: false,
          link: function link($scope, element) {
            var treeMap = new _treemap2.default();
            var wrapper = element.find('.treemap-chart')[0];

            treeMap.build($scope.endpoint, $scope.cube, $scope.state, wrapper);
            treeMap.on('click', function (treeMapComponent, item) {
              $scope.$emit('treemap-click', treeMapComponent, item);
            });

            $scope.cutoffWarning = false;
            $scope.queryLoaded = true;
          }
        };
      }]);
    }
  }]);

  return TreemapDirective;
}();

exports.default = TreemapDirective;