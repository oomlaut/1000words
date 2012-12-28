'use strict';

/* Controllers */

function quickLookup($scope, $http){
	$http.get('languages/espanol.json').success(function(data){
		$scope.words = data;
	});
}
