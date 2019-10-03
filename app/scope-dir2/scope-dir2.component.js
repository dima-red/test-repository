angular
    .module("scopeDir2")
    .component("scopeDir2", {
        templateUrl: "./app/scope-dir2/scope-dir2.template.html",
        controller: ScopeDir2Controller
    });

    function ScopeDir2Controller($scope) {
        $scope.a = "text string 2";
        $scope.logThisAndScope = function() {
            console.log(this, $scope);
        }
    }