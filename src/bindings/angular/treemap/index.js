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

            $scope.cutoffWarning = false;
            $scope.queryLoaded = true;

            // TreeMap-Table:
            $scope.treeMapTable = {
              show: true,
              sortAttr: '_percentage',
              sortDesc: true,
              data: null,
              invertSorting: function(){ this.sortDesc = !this.sortDesc; },
              toggle: () => {
                let treeMapSection = $(".treemap-table");
                this.show ? treeMapSection.fadeOut() : treeMapSection.fadeIn();
                this.show = !this.show;
              },
              selectTableRow: (item) => {
                $scope.$emit('treemap-click', treeMap, item);
              }
            };
            treeMap.on('dataLoaded', (treeMapComponent, root) => {
              $scope.treeMapTable.data = root;
              $scope.$apply();
            });
            treeMap.on('click', (treeMapComponent, item) => {
              $scope.$emit('treemap-click', treeMapComponent, item);
            });
            treeMap.build($scope.endpoint, $scope.cube, $scope.state, wrapper);
          }
        }
      }
    ])
  }
}

export default TreemapDirective