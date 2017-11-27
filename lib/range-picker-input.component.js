module.exports = {
  template: '<input type="text" class="form-control" ng-keyup="$ctrl.parseValue()" placeholder="{{ $ctrl.placeholder }}" ng-click="$ctrl.pickerCtrl.openFor($ctrl.id)" ng-model-options="{ allowInvalid: true, \'*\': \'$inherit\' }" ng-class="{ \'focus\': $ctrl.pickerCtrl.targetDate == $ctrl.id }"  />',
  require: {
    ngModelCtrl: 'ngModel',
    pickerCtrl: '^rangePicker'
  },
  bindings: {
    id: '@',
    ngModel: '=',
    format: '<',
    placeholder: '<'
  },
  controller: ['$scope', '$element', '$timeout', function ($scope, $element, $timeout) {
    this.targetDateWatch;

    this.parseValue = () => {
      this.ngModelCtrl.$setViewValue($element.find('input').val());
    };

    this.$onInit = () => {
      this.ngModelCtrl.$render = () => {
        switch(this.pickerCtrl.bindAs) {
          case 'string':
            this.ngModel = moment(this.ngModelCtrl.$modelValue).toISOString();
            break;
          case 'date':
            this.ngModel = moment(this.ngModelCtrl.$modelValue).toDate();
            break;
          default:
            this.ngModel = moment(this.ngModelCtrl.$modelValue);
        }
      };

      this.ngModelCtrl.$parsers.unshift((_value) => {
        let value = moment(_value);
        if (value && value.isValid() && moment(_value, this.format, true).isValid()) {
          // $element.find('input').val(value.format(this.format));
          return value;
        }
        // $element.find('input').val(value.isValid() ? value.format(this.format) : _value);
        return value.isValid() ? value : _value;
      });

      this.ngModelCtrl.$formatters.push((_value) => {
        let value = moment(_value);
        if (value && value.isValid() && moment(_value, this.format, true).isValid()) {
          $element.find('input').val(value.format(this.format));
          return value.format(this.format);
        }
        $element.find('input').val(value.format(this.format));
        return value.isValid() ? value.format(this.format) : null;
      });

      this.ngModelCtrl.$setViewValue(this.ngModel);

      this.targetDateWatch = $scope.$watch('$ctrl.pickerCtrl.targetDate', (val) => {
        if (val == this.id) {
          $element.find('input').focus();
          this.ngModelCtrl.$setTouched();
        }
      });
    };

    this.$onDestroy = () => {
      this.targetDateWatch && this.targetDateWatch();
    };
  }]
};
