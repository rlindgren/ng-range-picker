angular.module('rangePicker', [])
.value('rangePickerConfig', require('./range-picker.config'))
.component('rangePickerInput', require('./range-picker-input.component'))
.component('rangePicker', require('./range-picker.component'));
