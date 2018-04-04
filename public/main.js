(function() {
  var app = angular.module('msisCapstone', ['ngRoute', 'ui.bootstrap']);

  app.controller('homeCtrl', function($scope) {
    $scope.sites = [
      {id: 1, name: 'site1', status: 'good'},
      {id: 2, name: 'site2', status: 'good'},
      {id: 3, name: 'site3', status: 'good'},
    ]
  });

  app.controller('siteCtrl', function($scope, siteId) {
    $scope.siteId = siteId;
  });

  app.config(function($routeProvider, $locationProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'views/pages/home.html',
        controller: 'homeCtrl'
      })
      .when('/site/:sid', {
        templateUrl: 'views/pages/site.html',
        controller: 'siteCtrl',
        resolve: {
          siteId: ($http, $route) => {
            return $route.current.params.sid;
          }
        }
      });

    $locationProvider.html5Mode(true);
  });
})();
