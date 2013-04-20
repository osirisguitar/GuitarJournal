var GuitarJournalApp = angular.module('GuitarJournalApp', ['ngCookies']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'home.html', 
        controller: "HomeCtrl"
      }).
      when('/app/', {
        templateUrl: 'home.html', 
        controller: "HomeCtrl"
      }).
      when('/login', {
        templateUrl: 'login.html',
        controller: "LoginCtrl"
      }).
      when('/sessions', {
        templateUrl: 'sessions.html', 
        controller: "SessionsCtrl"
      }).
      when('/session/:id', {
        templateUrl: 'session.html', 
        controller: "SessionCtrl"
      }).
      when('/goals', {
        templateUrl: 'goals.html', 
        controller: "GoalsCtrl"
      }).
      when('/goal/:id', {
        templateUrl: 'goal.html', 
        controller: "GoalCtrl"
      }).
      when('/stats', {
        templateUrl: 'stats.html', 
        controller: "StatsCtrl"
      }).
      when('/profile', {
        templateUrl: 'profile.html', 
        controller: "ProfileCtrl"
      }).
      when('/instrument/:id', {
        templateUrl: 'instrument.html', 
        controller: "InstrumentCtrl"
      });
    $locationProvider.html5Mode(true);
  }])
  .directive('fileChange', function () {

      var linker = function ($scope, element, attributes) {
          // onChange, push the files to $scope.files.
          element.bind('change', function (event) {
              var files = event.target.files;
              $scope.$apply(function () {
                  for (var i = 0, length = files.length; i < length; i++) {
                      $scope.files.push(files[i]);
                  }
              });
          });
      };

      return {
          restrict: 'A',
          link: linker
      };

  })
  .directive('file', function() {
    return {
      scope: { file: '=' },
      link: function(scope, el, attrs) {
          el.bind('change', function(event) {
              console.log("Directive!");
              var files = event.target.files;
              var file = files[0];
              scope.file = file;
//              scope.file = file ? file.name : undefined;
              scope.$apply();
          });
      }
    }
  })
  .filter('take', function() {
    return function(input, numItems) {
      if (!input || !input.length)
        return input;

      return input.filter(function(elem, index) {
        return index < numItems;
      });
    }

  });