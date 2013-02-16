var GuitarJournalApp = angular.module('GuitarJournalApp', []).
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
      when('/sessions', {
        templateUrl: 'sessions.html', 
        controller: "SessionsCtrl"
      }).
      when('/session/:id', {
        templateUrl: 'session.html', 
        controller: "SessionCtrl"
      });
    $locationProvider.html5Mode(true);
  }]);