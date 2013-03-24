var GuitarJournalApp = angular.module('ComponentTestApp', [])
	.directive('clientComponent', function() {
		return {
			restrict: 'E',
			replace: true,
			template: '<mongo/>',
			link: function(scope, element, attrs) {
			}
		}
	});