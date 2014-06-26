angular-dragndrop-sortable
================================

Angular directive to sort an array with drag & drop. Depends only on AngularJS and HTML5. 

I implemented this, because I could not find a corresponding component with decent requirements.
For a simple feature like this, requiring jquery and/or angular-ui + jquery-ui is just not ok.

Check the demo application inside demo/. It's running live [here](https://rawgit.com/janneri/angular-dragndrop-sortable/master/demo/app/index.html).

# Usage

controller.js
```
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

    // optional (only needed if you want to listen to react to drag drop events)
    $scope.dragDropOptions = {
        // at the moment the only option is this callback function
        dragEndCallback: function() {
            console.log("drag ended");
        }
    };

    $http.get("/phones")
        .success(function(data) {
            $scope.phones = data;
        })
        .error(function(data) {});

});
```

index.html
```
<div ng-app="demo">

    <div ng-controller="DemoCtrl">

        <div class="col">
            <h3>Sortable table:</h3>
            <table style="border-collapse: collapse">
                <!-- Mark the element whose children are sortable with the attribute drag-drop-sortable -->
                <!-- Pass the sorted collection from controller to the directive by setting items="myColl" -->
                <tbody drag-drop-sortable items="phones">
                    <!-- the class sortable is required to mark sortable rows -->
                    <tr class="sortable" ng-repeat="phone in phones">
                        <td>{{phone.model}}</td>
                        <td>{{phone.name}}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="col">
            <h3>Sortable list:</h3>
            <ul drag-drop-sortable items="phones2" drag-drop-options="dragDropOptions">
                <li ng-repeat="phone in phones2" class="sortable">{{phone.name}}</li>
            </ul>
        </div>
    </div>

</div>

```