angular.module('admin', ['ui.router', 'ngResource']);

angular.module('admin').config(function($stateProvider, $urlRouterProvider) {

  'use strict';

  $stateProvider.when('/', {
        templateUrl: 'home.html'/*, 
        controller: "HomeCtrl"*/
      });

  /* Add New Routes Above */
  
  // For any unmatched url, redirect to /
  $urlRouterProvider.otherwise("/");

});

angular.module('admin').run(function($rootScope) {

  'use strict';

	$rootScope.safeApply = function(fn) {
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
