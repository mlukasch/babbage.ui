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
          template: "<div class=\"table-babbage\" ng-hide=\"queryLoaded\">\n  <div class=\"alert alert-info\">\n    <strong>You have not selected any data.</strong> Please choose a breakdown for\n    your treemap.\n  </div>\n</div>\n\n<div class=\"alert alert-warning\" ng-show=\"cutoffWarning\">\n  <strong>Too many tiles.</strong> The breakdown you have selected contains many\n  different categories, only the {{cutoff}} biggest are shown.\n</div>\n\n<div class=\"treemap-chart\"></div>\n\n<div class=\"treemap-table\">\n  <table class=\"nodetable table-striped\">\n    <thead>\n    <tr>\n      <th>\n        <a href=\"#\" ng-click=\"sortType = '_name'; sortReverse = !sortReverse\">\n          title\n          <span ng-show=\"sortType == '_name'\" class=\"fa\" ng-class=\"sortReverse ? 'fa-caret-up' : 'fa-caret-down'\"></span>\n        </a>\n      </th>\n      <th>\n        <a href=\"#\" ng-click=\"sortType = 'value'; sortReverse = !sortReverse\">\n          amount\n          <span ng-show=\"sortType == 'value'\" class=\"fa\" ng-class=\"sortReverse ? 'fa-caret-up' : 'fa-caret-down'\"></span>\n        </a>\n      </th>\n      <th>\n        <a href=\"#\" ng-click=\"sortType = '_percentage'; sortReverse = !sortReverse\">\n          share\n          <span ng-show=\"sortType == '_percentage'\" class=\"fa\" ng-class=\"sortReverse ? 'fa-caret-up' : 'fa-caret-down'\"></span>\n        </a>\n      </th>\n    </tr>\n    </thead>\n    <tbody>\n    <tr ng-repeat=\"dataElement in treeMapData.children | orderBy:sortType:sortReverse\" class=\"datarow\">\n      <td><span class=\"colorbox\" ng-style=\"{'background-color':dataElement._color}\"></span>{{ dataElement._name }}</td>\n      <td>{{ dataElement._area_fmt }}</td>\n      <td>{{ (dataElement._percentage * 100).toFixed(2) }}%</td>\n    </tr>\n    </tbody>\n    <tfoot>\n      <tr>\n        <td>Total</td>\n        <td>{{ treeMapData.summary_fmt }}</td>\n        <td>100%</td>\n      </tr>\n    </tfoot>\n  </table>\n</div>\n",
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

            // TreeMap-Table:
            $scope.showTreeMapTable = false;
            $scope.sortType = 'value'; // set the default sort type
            $scope.sortReverse = true; // set the default sort order
            treeMap.on('textOverflow', function (treeMapComponent) {
              $scope.showTreeMapTable = true;
              $scope.$apply();
            });
            treeMap.on('dataLoaded', function (treeMapComponent, root) {
              $scope.treeMapData = root;
              $scope.$apply();
            });
          }
        };
      }]);
    }
  }]);

  return TreemapDirective;
}();

exports.default = TreemapDirective;