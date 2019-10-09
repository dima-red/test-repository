angular
    .module("myApp")
    .service("dataService", dataService)

function dataService() {
    this.name = "Vasya";
}