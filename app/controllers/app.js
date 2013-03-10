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
  }])
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
  });