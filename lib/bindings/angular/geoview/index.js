'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GeoViewDirective = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _geoview = require('../../../components/geoview');

var _geoview2 = _interopRequireDefault(_geoview);

var _directive = require('./directive');

var _directive2 = _interopRequireDefault(_directive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GeoViewDirective = exports.GeoViewDirective = function () {
  function GeoViewDirective() {
    _classCallCheck(this, GeoViewDirective);
  }

  _createClass(GeoViewDirective, [{
    key: 'init',
    value: function init(angularModule) {
      (0, _directive2.default)(angularModule);

      angularModule.directive('geoView', ['$q', function ($q) {
        return {
          restrict: 'EA',
          scope: {
            endpoint: '@',
            cosmoEndpoint: '@',
            cube: '@',
            type: '@',
            state: '=',
            countryCode: '@',
            currencySign: '@?'
          },
          template: '<geoview class="geoview-container" country-code="{{ countryCode }}" ' + 'currency-sign="{{ currencySign }}" cosmo-endpoint="{{ cosmoEndpoint }}" ' + 'values="values"></geoview>',
          replace: false,
          link: function link($scope, element) {
            var geoView = new _geoview2.default();

            $q(function (resolve, reject) {
              geoView.getGeoMapData($scope.endpoint, $scope.cube, $scope.state).then(resolve).catch(reject);
            }).then(function (result) {
              $scope.values = result;
            });
          }
        };
      }]);
    }
  }]);

  return GeoViewDirective;
}();

exports.default = GeoViewDirective;