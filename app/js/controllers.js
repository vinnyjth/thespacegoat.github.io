angular.module('resumeCYO.controllers', [])
.controller( function($scope){
  $scope.name = "Vincent Wilson";
  var date = new Date();
  $scope.age = date.getFullYear() - 1996;
});
