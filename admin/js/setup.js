angular.module('admin', ['ui.router', 'ngResource', 'ui.bootstrap']);

angular.module('admin').config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  'use strict';

  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'partial/home/home.html'
  });
	$stateProvider.state('users', {
    url: '/users',
    templateUrl: 'partial/users/users.html'
  });
	/* Add New Routes Above */
  
  // For any unmatched url, redirect to /
  $urlRouterProvider.otherwise("/");
  
  $locationProvider.html5Mode(true);
});

angular.module('admin').run(function ($rootScope) {
  'use strict';

  $rootScope.safeApply = function (fn) {
    var phase = $rootScope.$$phase;
    if (phase === '$apply' || phase === '$digest') {
      if (fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };

});