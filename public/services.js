angular.module('msisCapstone').factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

    // create user variable
    var user = null;

    // return available functions for use in the controllers
    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register
    });

    function isLoggedIn() {
      if(user) {
        return true;
      } else {
        return false;
      }
    }

    function login(username, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/user/login',
        {username: username, password: password})
        // handle success
        .then(function (data) {
          console.log(data);
          if(data.status === 200 && data.data.status){
            user = true;
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        },
        function (data) {
          console.log(data);
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function logout() {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/user/logout')
        // handle success
        .then(function (data) {
          user = false;
          deferred.resolve();
        },
        function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function register(username, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/user/register',
        {username: username, password: password})
        // handle success
        .then(function (data) {
          if(data.status === 200 && data.data.status){
            console.log('good');
            deferred.resolve();
          } else {
            deferred.reject();
          }
        },
        function (data) {
          console.log(data);
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function getUserStatus() {
      return $http.get('/user/status')
      // handle success
      .then(function (data) {
        user = data.data.status;
      },
      function (data) {
        user = false;
      });
    }
}]);
