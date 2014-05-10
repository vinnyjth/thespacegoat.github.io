  angular.module('resumeCYO', [
'ngRoute',
'resumeCYO.controllers'
]).
config(["$routeProvider", function($routeProvider){
  $routeProvider.
    when("/:page", {templateUrl: "partials/about-me.html", controller: "resumeCYO.controllers"});
}]);
