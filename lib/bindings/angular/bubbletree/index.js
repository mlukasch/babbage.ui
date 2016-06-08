'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BubbleTreeDirective = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bubbletree = require('../../../components/bubbletree');

var _bubbletree2 = _interopRequireDefault(_bubbletree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BubbleTreeDirective = exports.BubbleTreeDirective = function () {
  function BubbleTreeDirective() {
    _classCallCheck(this, BubbleTreeDirective);
  }

  _createClass(BubbleTreeDirective, [{
    key: 'init',
    value: function init(angularModule) {
      angularModule.directive('bubbletree', ['$window', function ($window) {
        return {
          restrict: 'EA',
          scope: {
            endpoint: '@',
            cube: '@',
            type: '@',
            state: '='
          },
          template: "<div class=\"table-babbage\" ng-hide=\"queryLoaded\">\n  <div class=\"alert alert-info\">\n    <strong>You have not selected any data.</strong> Please choose the\n    configuration for your chart.\n  </div>\n</div>\n\n<div class=\"alert alert-warning\" ng-show=\"cutoffWarning\">\n  <strong>Too many categories.</strong> There are more than {{cutoff}} items\n  in the selected drilldown.\n</div>\n\n<div style=\"width: 100%; padding-top: 60%; position: relative\">\n  <div class=\"bubbletree\" style=\"position: absolute; left: 0px; top: 0px; width: 100%; height: 100%\"/>\n</div>\n\n",
          replace: false,
          link: function link($scope, element) {
            var bubbleTree = new _bubbletree2.default();
            var wrapper = element.find('.bubbletree')[0];

            bubbleTree.build($scope.endpoint, $scope.cube, $scope.state, wrapper);
            bubbleTree.on('click', function (bubbleTreeComponent, item) {
              $scope.$emit('bubbletree-click', bubbleTreeComponent, item);
            });

            $scope.cutoffWarning = false;
            $scope.queryLoaded = true;
          }
        };
      }]);
    }
  }]);

  return BubbleTreeDirective;
}();

exports.default = BubbleTreeDirective;