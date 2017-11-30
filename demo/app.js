var app = angular.module('myApp', ['rangePicker']);

app.controller('appCtrl', function ($scope) {
  $scope.minDate = moment().subtract(12, 'days');
  $scope.maxDate = moment().add(12, 'days');

  $scope.range = {
    startDate: moment().subtract(2, 'day'),
    endDate: moment().add(2, 'day')
  };

  $scope.logChanged = (range) => {
    console.log(range);
  };
});
