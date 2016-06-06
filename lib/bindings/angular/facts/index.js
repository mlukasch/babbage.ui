'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FactsDirective = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _facts = require('../../../components/facts');

var _facts2 = _interopRequireDefault(_facts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FactsDirective = exports.FactsDirective = function () {
  function FactsDirective() {
    _classCallCheck(this, FactsDirective);
  }

  _createClass(FactsDirective, [{
    key: 'init',
    value: function init(angularModule) {
      angularModule.directive('facts', ['$timeout', '$q', function ($timeout, $q) {
        return {
          restrict: 'EA',
          scope: {
            endpoint: '@',
            cube: '@',
            state: '='
          },
          template: "<div class=\"table-babbage\" ng-show=\"tableData.columns.length\">\n  <table class=\"table table-bordered table-condensed\">\n    <thead>\n    <tr>\n      <th ng-repeat-start=\"header in tableData.headers\" class=\"title\">\n        {{header.label}}\n      </th>\n      <th ng-repeat-end class=\"operations\" ng-switch=\"getSort(header.key).direction\">\n          <span ng-switch-when=\"desc\" ng-click=\"setSort(header.key, 'asc')\" class=\"ng-link\">\n            <i class=\"fa fa-sort-desc\"></i>\n          </span>\n          <span ng-switch-when=\"asc\" ng-click=\"setSort(header.key, 'desc')\" class=\"ng-link\">\n            <i class=\"fa fa-sort-asc\"></i>\n          </span>\n          <span ng-switch-default ng-click=\"setSort(header.key, 'desc')\" class=\"ng-link\">\n            <i class=\"fa fa-sort\"></i>\n          </span>\n      </th>\n    </tr>\n    </thead>\n    <tbody>\n    <tr ng-repeat=\"rows in tableData.columns\">\n      <td ng-repeat=\"row in rows track by $index\" colspan=\"2\" ng-class=\"{'numeric': tableData.headers[$index].numeric}\" >\n          <span ng-if=\"tableData.headers[$index].numeric\">\n            {{ row | number }}\n          </span>\n          <span ng-if=\"!tableData.headers[$index].numeric\">\n            {{ row }}\n          </span>\n      </td>\n    </tr>\n    </tbody>\n  </table>\n  <div class=\"pager\">\n    <ul ng-show=\"showPager\" class=\"pagination pagination-sm\">\n      <li ng-class=\"{'disabled': !hasPrev}\">\n        <a class=\"ng-link\" ng-click=\"setPage(current - 1)\">&laquo;</a>\n      </li>\n      <li ng-repeat=\"page in pages\" ng-class=\"{'active': page.current}\">\n        <a class=\"ng-link\" ng-click=\"setPage(page.page)\">{{page.page + 1}}</a>\n      </li>\n      <li ng-class=\"{'disabled': !hasNext}\">\n        <a class=\"ng-link\" ng-click=\"setPage(current + 1)\">&raquo;</a>\n      </li>\n    </ul>\n  </div>\n</div>\n\n<div class=\"table-babbage\" ng-hide=\"tableData.columns.length || !queryLoaded\">\n  <div class=\"alert alert-info\">\n    <strong>You have not selected any data.</strong> Please choose a set of rows\n    and columns to generate a cross-table.\n  </div>\n</div>\n",
          replace: false,
          link: function link($scope, element) {
            function update() {
              $q(function (resolve, reject) {
                facts.getTableData($scope.endpoint, $scope.cube, $scope.state).then(resolve).catch(reject);
              }).then(function (tableData) {
                $scope.tableData = tableData;
                $scope.current = parseInt(tableData.info.page - 1, 10) || 0;
                $scope.num = Math.ceil(tableData.info.total / tableData.info.pageSize);
                var pages = [];
                var num = $scope.num;
                var range = 3;
                var low = $scope.current - range;
                var high = $scope.current + range;

                if (low < 0) {
                  low = 0;
                  high = Math.min(2 * range + 1, num);
                }
                if (high > num) {
                  high = num;
                  low = Math.max(1, num - 2 * range + 1);
                }

                for (var page = low; page <= high; page++) {
                  pages.push({
                    page: page,
                    current: page == $scope.current
                  });
                }
                $scope.hasPrev = $scope.current > 0;
                $scope.hasNext = $scope.current < num;
                $scope.showPager = num > 1;
                $scope.pages = pages;
              });
            }

            var facts = new _facts2.default();

            $scope.getSort = function (field) {
              return _.find($scope.state.order, { key: field });
            };

            $scope.setSort = function (key, direction) {
              $scope.state.order = [{ key: key, direction: direction }];
              update();
            };

            $scope.setPage = function (page) {
              if (page >= 0 && page <= $scope.num) {
                $scope.state.page = page + 1;
                update();
              }
            };

            update();
          }
        };
      }]);
    }
  }]);

  return FactsDirective;
}();

exports.default = FactsDirective;