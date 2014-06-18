'use strict';

var app = angular.module('recogVoteApp', ['ngResource']);

app.factory("UserVote", function($resource) {
	return $resource("<YOUR-ENDPOINT-HERE>(:id)" + "?$filter=Idir%20eq%20" + "'" + CurrentUser.UserName + "'", {
		// default params...
		id: '@Id',
		contentType: 'application/json'
	})
});

app.factory("Votes", function($resource) {
	return $resource("YOUR-ENDPOINT-HERE>(:id)", {
		// default params...
		id: '@Id',
		contentType: 'application/json'
	}, {
		// custom methods...
		'castVote': ({
			method: 'POST',
			headers: {'Content-Type': 'application/json'}
		}),
		'updateVote': ({
			method: 'PUT',
			headers: {'If-Match': '*', 'Content-Type': 'application/json'}
		})
	});
});

app.controller('voteCtrl', ['$http', '$scope', 'Votes', 'UserVote', function($http, $scope, Votes, UserVote, $resource) {
	var voteInfo;
	var sharepointSite = '<YOUR-SITE-URL>/';
	var listName = '<YOUR-LIST-NAME>';
	var URL = sharepointSite + '_vti_bin/ListData.svc/' + listName;	
	
	$scope.registerVote = function(itemID, voteItem) {
		// itemID: Unique ID of what the user is voting for
		// voteItem: Name of the item you're voting for, passed from view
		$scope.userVote = voteItem;
		
		UserVote.get(function(data){
			voteInfo = data.d.results;	
									
			if (voteInfo.length > 0) {
				// Vote record(s) returned
				if (voteInfo[0].Vote == itemID) {
					// Do nothing - Record exists/User has already voted for this ID
					$('#alreadyvoted').dialog({
						modal: true,
						buttons: {
							Gotchya: function() {
								$(this).dialog("close");
							}}
					});
				} else {
					if (voteInfo.length > 0 && voteInfo[0].Vote > 0) {
						// User has a vote in the system, update it...						
						$('#updatevote').dialog({
							modal: true,
							buttons: {
								Gotchya: function() {
									$(this).dialog("close");
								}}
						});
						Votes.updateVote({'Id': $scope.userVoteId, 'Vote': itemID, 'Idir': $scope.currUser.UserName});
					} else {
						// User doesn't have a vote, cast a new one...
						Votes.castVote({'Title': null, 'Vote': itemID, 'Idir': $scope.currUser.UserName});
						$('#newvote').dialog({
							modal: true,
							buttons: {
								Gotchya: function() {
									$(this).dialog("close");
								}}
						});
					}
				}
			} else {
				// User doesn't have a vote, cast a new one...
				Votes.castVote({'Title': null, 'Vote': itemID, 'Idir': $scope.currUser.UserName});
				$('#newvote').dialog({
					modal: true,
					buttons: {
						Gotchya: function() {
							$(this).dialog("close");
						}}
				});
			}
		});
	};
	
	$scope.userVote 	= 0;
	$scope.userVoteId 	= 0;
	$scope.currUser 	= CurrentUser;
	$scope.voteItem 	= '';
	
	// Pull current user's vote (if any)...
	UserVote.get(function(data){
		if (data.d.results.length > 0) {
			$scope.userVote = data.d.results[0].Vote;
			$scope.userVoteId = data.d.results[0].Id;
		}
	});
}]);
