/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('rangePicker', []).value('rangePickerConfig', __webpack_require__(1)).component('rangePickerInput', __webpack_require__(2)).component('rangePicker', __webpack_require__(3));

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = {
  _currentId: 0,
  editable: true,
  placement: 'bottom-left',
  bindAs: 'moment',
  dayLabels: moment.localeData()._weekdaysMin,
  separator: ' - ',
  startPlaceholder: 'Start',
  endPlaceholder: 'End',
  yearFormat: 'YYYY',
  monthFormat: 'MMMM',
  dayFormat: 'D',
  displayFormat: 'M/D/YY',
  monthListFormat: 'MMM',
  container: null,
  offsetTop: 0,
  offsetRight: 0,
  offsetBottom: 0,
  offsetLeft: 0,
  buttonClass: 'btn-default btn-sm',
  inputClass: ''
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

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
    var _this = this;

    this.targetDateWatch;

    this.parseValue = function () {
      _this.ngModelCtrl.$setViewValue($element.find('input').val());
    };

    this.$onInit = function () {
      _this.ngModelCtrl.$render = function () {
        switch (_this.pickerCtrl.bindAs) {
          case 'string':
            _this.ngModel = moment(_this.ngModelCtrl.$modelValue).toISOString();
            break;

          case 'date':
            _this.ngModel = moment(_this.ngModelCtrl.$modelValue).toDate();
            break;

          default:
            _this.ngModel = moment(_this.ngModelCtrl.$modelValue);
        }
      };

      _this.ngModelCtrl.$parsers.unshift(function (_value) {
        var value = moment(_value);

        if (value && value.isValid() && moment(_value, _this.format, true).isValid()) {
          // $element.find('input').val(value.format(this.format));
          return value;
        } // $element.find('input').val(value.isValid() ? value.format(this.format) : _value);


        return value.isValid() ? value : _value;
      });

      _this.ngModelCtrl.$formatters.push(function (_value) {
        var value = moment(_value);

        if (value && value.isValid() && moment(_value, _this.format, true).isValid()) {
          $element.find('input').val(value.format(_this.format));
          return value.format(_this.format);
        }

        $element.find('input').val(value.format(_this.format));
        return value.isValid() ? value.format(_this.format) : null;
      });

      _this.ngModelCtrl.$setViewValue(_this.ngModel);

      _this.targetDateWatch = $scope.$watch('$ctrl.pickerCtrl.targetDate', function (val) {
        if (val == _this.id) {
          $element.find('input').focus();

          _this.ngModelCtrl.$setTouched();
        }
      });
    };

    this.$onDestroy = function () {
      _this.targetDateWatch && _this.targetDateWatch();
    };
  }]
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

function _sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return _sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

module.exports = {
  template: __webpack_require__(4),
  bindings: {
    name: '@',
    ngModel: '=',
    editable: '<',
    placement: '@',
    separator: '@',
    startPlaceholder: '@',
    endPlaceholder: '@',
    bindAs: '@',
    inline: '<',
    minDate: '<',
    maxDate: '<',
    dayLabels: '<',
    yearFormat: '<',
    monthFormat: '<',
    dayFormat: '<',
    monthListFormat: '<',
    displayFormat: '<',
    rangeChanged: '&',
    container: '@',
    offsetTop: '<',
    offsetRight: '<',
    offsetBottom: '<',
    offsetLeft: '<',
    buttonClass: '@',
    inputClass: '@'
  },
  controllerAs: '$picker',
  controller: ['$scope', '$element', '$timeout', 'rangePickerConfig', function ($scope, $element, $timeout, rangePickerConfig) {
    var _this = this;

    this._id = 'range_picker_' + ++rangePickerConfig._currentId;
    this._tether = null;
    this.calendarEl;
    this.inputEl = $element.find('.nrp-range-input input');

    this.setLastModel = function () {
      _this.lastModel = {
        startDate: _this.ngModel && _this.ngModel.startDate,
        endDate: _this.ngModel && _this.ngModel.endDate
      };
    };

    this.setLastModel();
    this.editable = typeof this.editable == 'undefined' ? rangePickerConfig.editable : this.editable, this.placement = this.placement || rangePickerConfig.placement;
    this.separator = this.separator || rangePickerConfig.separator;
    this.startPlaceholder = this.startPlaceholder || rangePickerConfig.startPlaceholder;
    this.endPlaceholder = this.endPlaceholder || rangePickerConfig.endPlaceholder;
    this.bindAs = this.bindAs || rangePickerConfig.bindAs;
    this.dayLabels = this.dayLabels || rangePickerConfig.dayLabels;
    this.yearFormat = this.yearFormat || rangePickerConfig.yearFormat;
    this.monthFormat = this.monthFormat || rangePickerConfig.monthFormat;
    this.dayFormat = this.dayFormat || rangePickerConfig.dayFormat;
    this.displayFormat = this.displayFormat || rangePickerConfig.displayFormat;
    this.monthListFormat = this.monthListFormat || rangePickerConfig.monthListFormat;
    this.offsetTop = this.offsetTop || rangePickerConfig.offsetTop;
    this.offsetRight = this.offsetRight || rangePickerConfig.offsetRight;
    this.offsetBottom = this.offsetBottom || rangePickerConfig.offsetBottom;
    this.offsetLeft = this.offsetLeft || rangePickerConfig.offsetLeft;
    this.buttonClass = this.buttonClass || rangePickerConfig.buttonClass;
    this.inputClass = this.inputClass || rangePickerConfig.inputClass;
    this.minDate = this.minDate ? moment(this.minDate).startOf('day').hours(12) : null;
    this.maxDate = this.maxDate ? moment(this.maxDate).startOf('day').hours(12) : null;
    this.showDays = true;
    this.showMonths = false;
    this.showYears = false; // on component initialized

    this.$onInit = function () {
      if (_this.inline) {
        _this.openFor('startDate');
      }

      var startWatch = $scope.$watch('$picker.ngModel.startDate', function (n, o) {
        if (n && +n !== +o) {
          if (+moment(n).isAfter(moment(_this.ngModel.endDate))) {
            _this.ngModel.endDate = moment(_this.ngModel.startDate);
          }

          _this.getDays(moment(n));
        }
      });
      var endWatch = $scope.$watch('$picker.ngModel.endDate', function (n, o) {
        if (n && +n !== +o) {
          if (+moment(n).isBefore(moment(_this.ngModel.startDate))) {
            _this.ngModel.startDate = moment(_this.ngModel.endDate);
          }

          _this.getDays(moment(n));
        }
      });
      $scope.$on('$destroy', function () {
        startWatch();
        endWatch();
      });
    }; // on component destroyed


    this.$onDestroy = function () {
      $(document).off('click.' + _this._id, _this.clickWatcher);

      if (_this._tether) {
        _this._tether.destroy();
      }
    };

    this.inputValue = function () {
      var ret = '';

      if (_this.ngModel.startDate || _this.ngModel.endDate) {
        if (_this.ngModel.startDate) {
          ret += moment(_this.ngModel.startDate).format(_this.displayFormat);
        } else {
          ret += _this.startPlaceholder;
        }

        ret += _this.separator;

        if (_this.ngModel.endDate) {
          ret += moment(_this.ngModel.endDate).format(_this.displayFormat);
        } else {
          ret += _this.endPlaceholder;
        }
      }

      return ret;
    };

    this.inputChanged = function ($event) {
      var _$event$target$value$ = $event.target.value.split(_this.separator),
          _$event$target$value$2 = _slicedToArray(_$event$target$value$, 2),
          start = _$event$target$value$2[0],
          end = _$event$target$value$2[1];

      start = moment(start);
      end = moment(end);

      if (start.isValid()) {
        _this.ngModel.startDate = start;
      }

      if (end.isValid()) {
        _this.ngModel.endDate = end;
      }
    };

    this.show = function () {
      _this.shown = true;
      $(document).on('click.' + _this._id, _this.clickWatcher);
    };

    this.hide = function () {
      $(document).off('click.' + _this._id, _this.clickWatcher);
      $timeout(function () {
        if (!_this.inline) {
          _this.shown = false;
        }

        _this.targetDate = null;
      }, 60);
    };

    this.changedFromLast = function () {
      return !!_this.ngModel && +_this.ngModel.startDate !== +_this.lastModel.startDate || +_this.ngModel.endDate !== +_this.lastModel.endDate;
    };

    this.openFor = function (date) {
      _this.targetDate = date;
      _this.displayDate = _this.ngModel[_this.targetDate] ? moment(_this.ngModel[_this.targetDate]) : moment();

      if (!_this.displayDate.isValid()) {
        _this.displayDate = moment();
      }

      _this.switchView('days');

      _this.showDays = true;

      _this.show();

      _this.calendarEl = $element.find('.nrp-range-display-calendar');
      _this.displayEl = $element.find('.nrp-range-display');

      if (!_this.inline) {
        _this.calendarEl = $element.find('#' + _this._id);

        _this.tether(_this.calendarEl[0], _this.displayEl[0]);

        setTimeout(function () {
          return _this._tether.position();
        });
      }
    };

    this.switchView = function (period) {
      period = period.charAt(0).toUpperCase() + period.slice(1);
      _this.showDays = false;
      _this.showMonths = false;
      _this.showYears = false;

      _this['get' + period](_this.displayDate);

      _this['show' + period] = true;
    };

    this.setDate = function (targetDate, date) {
      _this.ngModel = _this.ngModel || {};
      _this.ngModel[targetDate] = moment(date);
    };

    this.setRange = function (range) {
      _this.setDate('startDate', range.startDate);

      _this.setDate('endDate', range.endDate);
    };

    this.runChanged = function (hide) {
      if (_this.changedFromLast()) {
        _this.ngModel.startDate = moment(_this.ngModel.startDate);
        _this.ngModel.endDate = moment(_this.ngModel.endDate);

        _this.rangeChanged({
          $range: _this.ngModel
        });

        _this.setLastModel();

        if (hide) {
          _this.hide();
        }
      }

      _this.inputEl.val(_this.inputValue());
    };

    this.isValid = function () {
      return !!_this.ngModel.startDate && !!_this.ngModel.endDate;
    };

    this.selectDay = function (day) {
      if (!day.isValid) {
        return;
      }

      if (!_this.targetDate) {
        _this.targetDate = 'startDate';
      }

      _this.setDate(_this.targetDate, moment(_this.displayDate).date(day.value));

      if (_this.targetDate == 'startDate') {
        if (!_this.ngModel.endDate || moment(_this.ngModel.startDate).isAfter(moment(_this.ngModel.endDate))) {
          _this.setDate('endDate', moment(_this.ngModel.startDate));
        }

        _this.targetDate = 'endDate';
      } else {
        if (!_this.ngModel.startDate || moment(_this.ngModel.startDate).isAfter(_this.ngModel.endDate)) {
          _this.setDate('startDate', moment(_this.ngModel.endDate));

          _this.targetDate = 'endDate';
        } else {// if (!this.inline) {
          //   this.runChanged();
          // }
        }
      }
    };

    this.selectMonth = function (month) {
      _this.displayDate = moment(_this.displayDate).month(month.value);

      _this.switchView('days');
    };

    this.selectYear = function (year) {
      _this.displayDate = moment(_this.displayDate).year(year.value);

      _this.switchView('months');
    };

    this.chooseDisplay = function (period, value) {
      _this.displayDate = moment(_this.targetDate)[period](value);
    };

    this.next = function (period) {
      _this.getDays(moment(_this.displayDate).add(1, period));
    };

    this.prev = function (period) {
      _this.getDays(moment(_this.displayDate).subtract(1, period));
    };

    this.nextMonths = function () {
      _this.getMonths(moment(_this.displayDate).add(1, 'year'));
    };

    this.prevMonths = function () {
      _this.getMonths(moment(_this.displayDate).subtract(1, 'year'));
    };

    this.nextYears = function () {
      _this.getYears(moment(_this.displayDate).add(12, 'year'));
    };

    this.prevYears = function () {
      _this.getYears(moment(_this.displayDate).subtract(12, 'year'));
    };

    this.yearPagePrev = function () {
      if (_this.showDays) {
        _this.prev('years');
      } else if (_this.showMonths) {
        _this.prevMonths();
      } else {
        _this.prevYears();
      }
    };

    this.yearPageNext = function () {
      if (_this.showDays) {
        _this.next('years');
      } else if (_this.showMonths) {
        _this.nextMonths();
      } else {
        _this.nextYears();
      }
    };

    this.isValidDate = function (date) {
      if (_this.minDate && moment(_this.minDate).isAfter(date)) {
        return false;
      }

      if (_this.maxDate && moment(_this.maxDate).isBefore(date)) {
        return false;
      }

      return true;
    };

    this.getDays = function (date) {
      date = moment(date).hours(12).startOf('day').hours(12);
      _this.daysInMonth = moment(date).daysInMonth();
      var today = moment();
      var days = [];
      var startDay = moment(date).startOf('month').day();
      var displayedDays = _this.daysInMonth + startDay;
      displayedDays += 7 - (displayedDays % 7 || 7);
      var start = moment(_this.ngModel.startDate).hours(12).startOf('day').hours(12);
      var end = moment(_this.ngModel.endDate).hours(12).startOf('day').hours(12);

      for (var i = 0; i < displayedDays; i++) {
        var mo = moment(date).date(i - startDay + 1);
        days.push({
          value: i < startDay ? -(startDay - i) + 1 : i - startDay + 1,
          label: mo.format(_this.dayFormat),
          isCurrent: mo.isSame(today, 'day'),
          isValid: _this.isValidDate(mo),
          isStart: mo.isSame(start, 'day'),
          isEnd: mo.isSame(end, 'day'),
          inRange: mo.isBefore(end) && mo.isAfter(start)
        });
      }

      _this.days = days;
      _this.displayDate = moment(date);
    };

    this.getMonths = function (date) {
      var today = moment();
      var startDay = moment(date).startOf('year');
      var months = [];

      for (var i = 0; i < 12; i++) {
        var mo = moment(startDay).add(i, 'months');
        months.push({
          value: i,
          label: mo.format(_this.monthListFormat),
          isCurrent: mo.isSame(today, 'month'),
          isValid: _this.isValidDate(moment(mo).startOf('day').hours(12)),
          isStart: mo.isSame(_this.ngModel.startDate, 'month'),
          isEnd: mo.isSame(_this.ngModel.endDate, 'month'),
          inRange: mo.isBefore(_this.ngModel.endDate) && mo.isAfter(_this.ngModel.startDate)
        });
      }

      _this.months = months;
      _this.displayDate = moment(date);
    };

    this.getYears = function (date) {
      var today = moment();
      var startDay = moment(date).startOf('year').subtract(moment(date).year() % 10, 'years');
      var years = [];

      for (var i = 0; i < 12; i++) {
        var mo = moment(startDay).add(i, 'year');
        years.push({
          value: mo.year(),
          label: mo.format(_this.yearFormat),
          isCurrent: mo.isSame(today, 'year'),
          isValid: _this.isValidDate(moment(mo).startOf('day').hours(12)),
          isStart: mo.isSame(_this.ngModel.startDate, 'year'),
          isEnd: mo.isSame(_this.ngModel.endDate, 'year'),
          inRange: mo.isBefore(_this.ngModel.endDate) && mo.isAfter(_this.ngModel.startDate)
        });
      }

      _this.years = years;
      _this.displayDate = moment(date);
    };

    this.tether = function (e, t) {
      if (_this._tether) {
        _this._tether.position();

        return;
      }

      var positions = {
        'top': ['bottom middle', 'top middle'],
        'bottom': ['top middle', 'bottom middle'],
        'left': ['middle right', 'middle left'],
        'right': ['middle left', 'middle right'],
        'top left': ['bottom left', _this.placement],
        'top right': ['bottom right', _this.placement],
        'bottom left': ['top left', _this.placement],
        'bottom right': ['top right', _this.placement],
        'left top': ['top right', 'top left'],
        'right top': ['top left', 'top right'],
        'left bottom': ['bottom right', 'bottom left'],
        'right bottom': ['bottom left', 'bottom right']
      };
      var placement = positions[_this.placement];
      _this._tether = new Tether({
        element: e,
        target: t,
        attachment: placement ? placement[0] : 'top left',
        targetAttachment: placement ? placement[1] : 'bottom left',
        constraints: [{
          to: 'scrollParent',
          pin: true
        }, {
          to: 'window',
          attachment: 'together'
        }]
      });
    };

    this.clickWatcher = function (e) {
      if (_this.container) {
        _this.calendarEl = $('#' + _this._id);
      }

      if (_this.shown && !_this.clickedInside(e.target, _this.displayEl[0], _this.calendarEl[0])) {
        _this.hide();
      }
    };

    this.clickedInside = function (t, e, o) {
      var has = t === e || t === o;

      while (t.parentElement) {
        if (t.parentElement === e || t.parentElement === o) {
          has = true;
          break;
        }

        t = t.parentElement;
      }

      return !!has;
    };
  }]
};

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = "<div class=nrp-picker>\n  <div class=nrp-range-display>\n    <div class=nrp-range-display-buttons ng-hide=$picker.editable>\n      <div class=btn-group role=group>\n        <button type=button class=\"btn nrp-range-button {{ $picker.buttonClass }}\" ng-click=\"$picker.openFor('startDate')\" ng-class=\"{ 'btn-primary active': $picker.targetDate == 'startDate' }\">\n          {{ $picker.ngModel.startDate.format($picker.displayFormat) || $picker.startPlaceholder }}\n        </button>\n        <button type=button class=\"btn nrp-range-button {{ $picker.buttonClass }}\" ng-click=\"$picker.openFor('endDate')\" ng-class=\"{ 'btn-primary active': $picker.targetDate == 'endDate' }\">\n          {{ $picker.ngModel.endDate.format($picker.displayFormat) || $picker.endPlaceholder }}\n        </button>\n      </div>\n      <div class=nrp-range-arrow></div>\n    </div>\n    <div class=nrp-range-input ng-show=$picker.editable>\n      <input class=\"form-control {{ $picker.inputClass }}\" type=text ng-keyup=$picker.inputChanged($event) ng-click=\"$event.stopPropagation(); $picker.openFor('startDate')\" value=\"{{ $picker.inputValue() }}\" placeholder=\"{{ $picker.startPlaceholder + $picker.separator + $picker.endPlaceholder }}\"/>\n    </div>\n  </div>\n  <div class=nrp-range-display-calendar id={{$picker._id}} ng-class=\"{inline: $picker.inline}\" ng-show=$picker.shown>\n    <div class=nrp-range-display-calendar-ranges ng-show=\"$picker.ranges && $picker.ranges.length\">\n      <div class=\"nrp-calendar-range nrp-clickable\" ng-repeat=\"range in $picker.ranges\" ng-click=$picker.setRange(range)>\n        <div class=\"nrp-range nrp-centered\">{{ range.label }}</div>\n      </div>\n    </div>\n    <div class=nrp-range-display-calendar-calendar>\n      <div class=\"nrp-range-inputs form-inline\">\n        <range-picker-input id=startDate ng-model=$picker.ngModel.startDate format=$picker.displayFormat placeholder=$picker.displayFormat></range-picker-input>\n        <range-picker-input id=endDate ng-model=$picker.ngModel.endDate format=$picker.displayFormat placeholder=$picker.displayFormat></range-picker-input>\n        <div class=nrp-range-arrow></div>\n      </div>\n      <div class=\"nrp-range-calendar-header nrp-year\">\n        <div class=nrp-arrow-left ng-click=$picker.yearPagePrev()>\n          <button type=button class=\"btn btn-link btn-sm\">&lt;</button>\n        </div>\n        <div class=\"nrp-header-val nrp-centered nrp-clickable\" ng-click=\"$picker.switchView('years')\" ng-hide=$picker.showYears>\n          {{ $picker.displayDate.format($picker.yearFormat) }}\n        </div>\n        <div class=nrp-arrow-right ng-click=$picker.yearPageNext()>\n          <button type=button class=\"btn btn-link btn-sm\">&gt;</button>\n        </div>\n      </div>\n      <div class=\"nrp-range-calendar-header nrp-month\" ng-show=$picker.showDays>\n        <div class=nrp-arrow-left ng-click=\"$picker.prev('month')\">\n          <button type=button class=\"btn btn-link btn-sm\">&lt;</button>\n        </div>\n        <div class=\"nrp-header-val nrp-centered nrp-clickable\" ng-click=\"$picker.switchView('months')\">\n          {{ $picker.displayDate.format($picker.monthFormat) }}\n        </div>\n        <div class=nrp-arrow-right ng-click=\"$picker.next('month')\">\n          <button type=button class=\"btn btn-link btn-sm\">&gt;</button>\n        </div>\n      </div>\n      <div class=\"nrp-range-calendar-body nrp-days\" ng-show=$picker.showDays>\n        <div class=nrp-day-name ng-repeat=\"dayLabel in $picker.dayLabels track by dayLabel\">\n          {{ dayLabel }}\n        </div>\n        <div class=\"nrp-calendar-day nrp-clickable\" ng-repeat=\"day in $picker.days track by $index\" ng-click=$picker.selectDay(day) ng-class=\"{ 'nrp-start': day.isStart, 'nrp-end': day.isEnd, 'nrp-selected': day.inRange || day.isStart || day.isEnd, 'nrp-current': day.isCurrent, 'nrp-invalid': !day.isValid }\">\n          <div class=\"nrp-day nrp-centered\" ng-class=\"{'nrp-off-month': day.value <= 0 || day.value > $picker.daysInMonth}\">\n            {{ day.label }}\n          </div>\n        </div>\n      </div>\n      <div class=\"nrp-range-calendar-body nrp-months\" ng-show=$picker.showMonths>\n        <div class=\"nrp-calendar-month nrp-clickable\" ng-repeat=\"month in $picker.months track by $index\" ng-click=$picker.selectMonth(month) ng-class=\"{ 'nrp-start': month.isStart, 'nrp-end': month.isEnd, 'nrp-selected': month.inRange || month.isStart || month.isEnd, 'nrp-current': month.isCurrent, 'nrp-invalid': !month.isValid }\">\n          <div class=\"month centered\">\n            {{ month.label }}\n          </div>\n        </div>\n      </div>\n      <div class=\"nrp-range-calendar-body nrp-years\" ng-show=$picker.showYears>\n        <div class=\"nrp-calendar-year nrp-clickable\" ng-repeat=\"year in $picker.years track by $index\" ng-click=$picker.selectYear(year) ng-class=\"{ 'nrp-start': year.isStart, 'nrp-end': year.isEnd, 'nrp-selected': year.inRange || year.isStart || year.isEnd, 'nrp-current': year.isCurrent, 'nrp-invalid': !year.isValid }\">\n          <div class=\"nrp-year nrp-centered\">\n            {{ year.label }}\n          </div>\n        </div>\n      </div>\n      <button type=button style=\"display:inline-block;margin:2px;width:calc(100% - 4px)\" class=\"btn btn-success btn-block\" ng-show=\"$picker.showDays && $picker.changedFromLast() && $picker.isValid()\" ng-click=$picker.runChanged(true)>\n        OK\n\n      </button>\n    </div>\n  </div>\n</div>";

/***/ })
/******/ ]);