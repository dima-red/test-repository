angular
    .module("thisDir1")
    .component("thisDir1", {
        templateUrl: "./app/this-dir1/this-dir1.template.html",
        controllerAs: "third",
        controller: ThisDir1Controller
    });

    function ThisDir1Controller($scope, dataService) {
        this.dataService = dataService;
        this.a = "text string 3";
        this.logThisAndScope = function() {
            console.log(this, $scope);
        }
    }