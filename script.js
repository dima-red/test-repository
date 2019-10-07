angular
    .module("demo", [])
    .controller("ScopeController1", ScopeController1)
    .controller("ScopeController2", ScopeController2)
    .controller("ThisController1", ThisController1)
    .controller("ThisController2", ThisController2)
    .service("MyService", MyService)

function ScopeController1($scope, MyService) {
    $scope.MyService = MyService;
    $scope.logThisAndScope = function() {
        console.log(this, $scope);
    }
}

function ScopeController2($scope, MyService) {
    $scope.MyService = MyService;
    $scope.logThisAndScope = function() {
        console.log(this, $scope);
    }
}

function ThisController1($scope, MyService) {
    this.MyService = MyService;
    this.name = "Egor";
    this.logThisAndScope = function() {
        console.log(this, $scope);
    }
}

function ThisController2($scope, MyService) {
    this.MyService = MyService;
    // this.name = "Vasya";
    this.logThisAndScope = function() {
        console.log(this, $scope);
    }
}

function MyService() {
    this.name = "Vasya";
}