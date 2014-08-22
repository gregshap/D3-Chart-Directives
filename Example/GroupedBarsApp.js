var Dash2App = angular.module('Dash2App', ['dash2.charts.groupedbar','dash2.charts.stackedbar','dash2.charts.stack2','dash2.charts.multiline']);


  Dash2App.controller('Dash2Ctrl',function Dash2Ctrl($scope,$http) {
      

    //Reformat from the web api format with items and junk, into arrays
      //This doesn't need to do anything when we're just grabbing a flat json file
      var reformatExternalResource= function(data){

          return data["chartpoints"];
      };
      
    $scope.getData = function () {
          $http({
            method: 'GET',
            url:'/data/chartdata.json'
          }).
          success(function (data) {
            // attach this data to the scope
            $scope.sourcedata = reformatExternalResource(data);
            

            // clear the error messages
            $scope.sourcedataerror = '';
          }).
          error(function (data, status) {
            if (status === 404) {
              $scope.error = 'Couldnt load the data';
            } else {
              $scope.error = 'Error: ' + status;
            }
          });
      }


      $scope.getLineData = function () {
          $http({
            method: 'GET',
            url:'/data/linedata.json'
          }).
          success(function (data) {
            // attach this data to the scope
            $scope.sourceLineData = reformatExternalResource(data);
            

            // clear the error messages
            $scope.sourcedataerror = '';
          }).
          error(function (data, status) {
            if (status === 404) {
              $scope.error = 'Couldnt load the data';
            } else {
              $scope.error = 'Error: ' + status;
            }
          });
      }

      $scope.getStackData = function () {
          $http({
            method: 'GET',
            url:'/data/stackdata.json'
          }).
          success(function (data) {
            // attach this data to the scope
            $scope.sourceStackData = reformatExternalResource(data);
            

            // clear the error messages
            $scope.sourcedataerror = '';
          }).
          error(function (data, status) {
            if (status === 404) {
              $scope.error = 'Couldnt load the data';
            } else {
              $scope.error = 'Error: ' + status;
            }
          });
      }

    //Get the data off the bat, since we have no filters
    $scope.getData();
    $scope.getLineData();
    $scope.getStackData();

  });

