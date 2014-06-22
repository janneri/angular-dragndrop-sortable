var app = angular.module('demo', ['jmr-drag-drop-sortable', 'ngMockE2E']);

app.run(function($httpBackend) {
    phones = [{model: 1, name: 'phone1'}, {model: 2, name: 'phone2'}, {model: 3, name: 'phone3'}];

    $httpBackend.whenGET('/phones').respond(phones);
    $httpBackend.whenGET(/.*/).passThrough();
});

app.controller('DemoCtrl', function($scope, $http) {
    'use strict';

    $scope.phones = [];
    $scope.phones2 = [{model: 1, name: 'xx'}, {model: 2, name: 'yy'}, {model: 3, name: 'zz'}, {model: 4, name: 'qq'}];

    $http.get("/phones")
        .success(function(data) {
            $scope.phones = data;
        })
        .error(function(data) {});

});