angular
    .module("thisDir2")
    .component("thisDir2", {
        templateUrl: "./app/this-dir2/this-dir2.template.html",
        controllerAs: "fourth",
        controller: ThisDir2Controller
    });

    function ThisDir2Controller($scope) {
        this.a = "text string 4";
        this.logThisAndScope = function() {
            console.log(this, $scope);
        }
    }