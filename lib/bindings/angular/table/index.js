'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BabbageTableDirective = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _table = require('../../../components/table');

var _table2 = _interopRequireDefault(_table);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BabbageTableDirective = exports.BabbageTableDirective = function () {
  function BabbageTableDirective() {
    _classCallCheck(this, BabbageTableDirective);
  }

  _createClass(BabbageTableDirective, [{
    key: 'init',
    value: function init(angularModule) {
      angularModule.directive('babbageTable', ['$timeout', '$q', function ($timeout, $q) {
        return {
          restrict: 'EA',
          scope: {
            endpoint: '@',
            cube: '@',
            state: '='
          },
          template: "<div class=\"table-babbage\" ng-show=\"tableData.columns.length\">\n  <table class=\"table table-bordered table-condensed\">\n    <thead>\n    <tr ng-repeat=\"header in tableData.headers\">\n      <th ng-repeat=\"col in header\">\n        {{col}}\n      </th>\n    </tr>\n    </thead>\n    <tbody>\n    <tr ng-repeat=\"rows in tableData.columns\">\n      <td ng-repeat=\"dimension in rows.dimensions\">\n        {{dimension.nameValue}}\n      </td>\n      <td ng-repeat=\"measure in rows.measures\" class=\"numeric\">\n        {{ measure.value | number }}\n      </td>\n    </tr>\n    </tbody>\n  </table>\n</div>\n\n<div class=\"table-babbage\" ng-hide=\"tableData.columns.length || !queryLoaded\">\n  <div class=\"alert alert-info\">\n    <strong>You have not selected any data.</strong> Please choose a set of rows\n    and columns to generate a cross-table.\n  </div>\n</div>\n",
          replace: false,
          link: function link($scope, element) {
            var babbageTable = new _table2.default();

            $q(function (resolve, reject) {
              babbageTable.getTableData($scope.endpoint, $scope.cube, $scope.state).then(resolve).catch(reject);
            }).then(function (tableData) {
              $scope.tableData = tableData;
            });
          }
        };
      }]);
    }
  }]);

  return BabbageTableDirective;
}();

exports.default = BabbageTableDirective;