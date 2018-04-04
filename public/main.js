(function() {
  var app = angular.module('msisCapstone', ['ngRoute', 'ngMap', 'ui.bootstrap']);

  app.controller('homeCtrl', function($scope, NgMap) {
    $scope.sites = [
      {id: 1, name: 'site1', status: 'good', lat: 31.9, lng: -94.2},
      {id: 2, name: 'site2', status: 'good', lat: 37.4, lng: -81.5},
      {id: 3, name: 'site3', status: 'good', lat: 41.7, lng: -105.9},
    ];

    // url for google maps
    $scope.googleMapsUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyA8wxBsDNCPfzoixZ-m3QE3qQSpiVVmGU0';

    // map code adapted from: https://stackoverflow.com/questions/34792033/show-multiple-info-windows-with-ng-map-in-angularjs
    // declare a new ng map
    NgMap.getMap().then(function(map) {
      $scope.map = map;
    });

    // show the info window for a site when the user clicks on a new site marker
    $scope.showSite = function(event, site) {
      $scope.selectedSite = site;
      $scope.map.showInfoWindow('infoWindow', this);
    };

  });

  app.controller('siteCtrl', function($scope, siteId) {
    $scope.siteId = siteId;

  });

  app.controller('loginController', function ($scope, $location, AuthService) {

    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function () {
          $location.path('/');
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });

    };
  });

  app.controller('logoutController', function ($scope, $location, AuthService) {

      $scope.logout = function () {

        // call logout from service
        AuthService.logout()
          .then(function () {
            $location.path('/login');
          });

      };

  });

  app.controller('registerController', function ($scope, $location, AuthService) {
        
        $scope.register = function () {

          // initial values
          $scope.error = false;
          $scope.disabled = true;

          // call register from service
          AuthService.register($scope.registerForm.username, $scope.registerForm.password)
            // handle success
            .then(function () {
              $location.path('/login');
              $scope.disabled = false;
              $scope.registerForm = {};
            })
            // handle error
            .catch(function () {
              $scope.error = true;
              $scope.errorMessage = "Something went wrong!";
              $scope.disabled = false;
              $scope.registerForm = {};
            });

        };
  });

  app.config(function($routeProvider, $locationProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'views/pages/home.html',
        controller: 'homeCtrl',
        access: {restricted: true}
      })
      .when('/login', {
        templateUrl: 'views/pages/login.html',
        controller: 'loginController',
        access: {restricted: false}
      })
      .when('/logout', {
        controller: 'logoutController',
        access: {restricted: true}
      })
      .when('/register', {
        templateUrl: 'views/pages/register.html',
        controller: 'registerController',
        access: {restricted: false}
      })
      .when('/site/:sid', {
        templateUrl: 'views/pages/site.html',
        controller: 'siteCtrl',
        resolve: {
          siteId: ($http, $route) => {
            return $route.current.params.sid;
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  });

  app.run(function ($rootScope, $location, $route, AuthService) {
    $rootScope.$on('$routeChangeStart',
      function (event, next, current) {
        AuthService.getUserStatus()
        .then(function(){
          if (next.access.restricted && !AuthService.isLoggedIn()){
            $location.path('/login');
            $route.reload();
          }
        });
    });
  });
})();
