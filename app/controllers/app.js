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
      }).
      when('/goals', {
        templateUrl: 'goals.html', 
        controller: "GoalsCtrl"
      }).
      when('/goal/:id', {
        templateUrl: 'goal.html', 
        controller: "GoalCtrl"
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
  }]);