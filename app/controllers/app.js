var GuitarJournalApp = angular.module('GuitarJournalApp', ['ngCookies', 'angles', 'angular-growl']).
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
      when('/support', {
        templateUrl: '/app/support.html'
      }).
      when('/instrument/:id', {
        templateUrl: 'instrument.html', 
        controller: "InstrumentCtrl"
      });
    $locationProvider.html5Mode(true);
  }])
  .filter('take', function() {
    return function(input, numItems) {
      if (!input || !input.length)
        return input;

      return input.filter(function(elem, index) {
        return index < numItems;
      });
    };
  }).filter('suffix', function() {
    return function(input, suffix) {
      if (input)
        return input + suffix;
      else
        return input; 
    };
  });