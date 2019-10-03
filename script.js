angular
    .module("demo", [])
    .controller("ScopeController1", ScopeController1)
    .controller("ScopeController2", ScopeController2)
    .controller("ThisController1", ThisController1)
    .controller("ThisController2", ThisController2)

function ScopeController1($scope) {
    $scope.name = "Egor";
    $scope.logThisAndScope = function() {
        console.log(this, $scope);
    }
}

function ScopeController2($scope) {
    // $scope.name = "Vasya";
    $scope.logThisAndScope = function() {
        console.log(this, $scope);
    }
}

function ThisController1($scope) {
    this.name = "Egor";
    this.logThisAndScope = function() {
        console.log(this, $scope);
    }
}

function ThisController2($scope) {
    // this.name = "Vasya";
    this.logThisAndScope = function() {
        console.log(this, $scope);
    }
}