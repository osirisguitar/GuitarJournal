var GuitarJournalApp = angular.module('GuitarJournalApp', ['ngRoute', 'ngCookies', 'ngAnimate', 'ngRouteAnimationManager', 'angles', 'angular-growl']).
  config(['$routeProvider', '$locationProvider', 'RouteAnimationManagerProvider', function($routeProvider, $locationProvider, RouteAnimationManagerProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'home.html', 
        controller: "HomeCtrl",
        data: {
          animationConf: {
            fallback: "slideright"
          }
        }
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
        controller: "SessionsCtrl",
        data: {
          animationConf: {
            session: "slideright",
            goals: "slideright",
            stats: "slideright",
            profile: "slideright",
            fallback: "slideleft"
          }
        }
      }).
      when('/session/:id', {
        templateUrl: 'session.html', 
        controller: "SessionCtrl",
        data: {
          animationConf: {
            goals: "slideright",
            stats: "slideright",
            profile: "slideright",
            fallback: "slideleft"
          }
        }
      }).
      when('/session/', {
        templateUrl: 'session.html', 
        controller: "SessionCtrl",
        data: {
          animationConf: {
            goals: "slideright",
            stats: "slideright",
            profile: "slideright",
            fallback: "slideleft"
          }
        }
      }).
      when('/goals', {
        templateUrl: 'goals.html', 
        controller: "GoalsCtrl",
        data: {
          animationConf: {
            goal: "slideright",
            stats: "slideright",
            profile: "slideright",
            fallback: "slideleft"
          }
        }
      }).
      when('/goal/:id', {
        templateUrl: 'goal.html', 
        controller: "GoalCtrl",
        data: {
          animationConf: {
            stats: "slideright",
            profile: "slideright",
            fallback: "slideleft"
          }
        }
      }).
      when('/goal/', {
        templateUrl: 'goal.html', 
        controller: "GoalCtrl",
        data: {
          animationConf: {
            stats: "slideright",
            profile: "slideright",
            fallback: "slideleft"
          }
        }
      }).
      when('/stats', {
        templateUrl: 'stats.html', 
        controller: "StatsCtrl",
        data: {
          animationConf: {
            profile: "slideright",
            fallback: "slideleft"
          }
        }
      }).
      when('/profile', {
        templateUrl: 'profile.html', 
        controller: "ProfileCtrl",
        data: {
          animationConf: {
            instrument: "slideright",
            fallback: "slideleft"
          }
        }
      }).
      when('/support', {
        templateUrl: '/app/support.html'
      }).
      when('/instrument/:id', {
        templateUrl: 'instrument.html', 
        controller: "InstrumentCtrl",
        data: {
          animationConf: {
            fallback: "slideleft"
          }
        }
      }).
      when('/instrument/', {
        templateUrl: 'instrument.html', 
        controller: "InstrumentCtrl",
        data: {
          animationConf: {
            fallback: "slideleft"
          }
        }
      });
    $locationProvider.html5Mode(true);
     
    RouteAnimationManagerProvider.setDefaultAnimation('slideleft'); //define a global default animation
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