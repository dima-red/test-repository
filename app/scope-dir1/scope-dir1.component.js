angular
    .module("scopeDir1")
    .component("scopeDir1", {
        templateUrl: "./app/scope-dir1/scope-dir1.template.html",
        controllerAs: "first",
        controller: ScopeDir1Controller
    });

    function ScopeDir1Controller($scope, dataService) {
        $scope.dataService = dataService;
        $scope.a = "text string 1";
        $scope.logThisAndScope = function() {
            console.log(this, $scope);
        }
    }