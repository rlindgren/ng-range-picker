angular.module('rangePicker', [])
.value('rangePickerConfig', require('./range-picker.config'))
.factory('rangePickerDelegate', require('./range-picker.delegate'))
.component('rangePickerInput', require('./range-picker-input.component'))
.component('rangePicker', require('./range-picker.component'));
