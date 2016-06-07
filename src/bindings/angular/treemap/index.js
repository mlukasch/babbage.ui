import TreeMapComponent from '../../../components/treemap'

class TreemapDirective {
  init(angularModule) {
    angularModule.directive('treeMap', [
      '$window',
      function($window) {
        return {
          restrict: 'EA',
          scope: {
            endpoint: '@',
            cube: '@',
            state: '='
          },
          template: require('./template.html'),
          replace: false,
          link: function($scope, element) {
            var treeMap = new TreeMapComponent();
            var wrapper = element.find('.treemap-chart')[0];

            treeMap.build($scope.endpoint, $scope.cube, $scope.state, wrapper);
            treeMap.on('click', (treeMapComponent, item) => {
              $scope.$emit('treemap-click', treeMapComponent, item);
            });

            $scope.cutoffWarning = false;
            $scope.queryLoaded = true;

            // TreeMap-Table:
            $scope.treeMapTable = {
              show: true,
              sortAttr: '_percentage',
              sortDesc: true,
              data: null,
              invertSorting: function(){ this.sortDesc = !this.sortDesc; },
              toggle: function() {
                var treeMapSection = $(".treemap-table");
                this.show ? treeMapSection.fadeOut() : treeMapSection.fadeIn();
                this.show = !this.show;
              }
            };
            treeMap.on('dataLoaded', (treeMapComponent, root) => {
              $scope.treeMapTable.data = root;
              $scope.$apply();
            });

          }
        }
      }
    ])
  }
}

export default TreemapDirective