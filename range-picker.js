angular.module('rangePicker', [])
.run(['$templateCache', function ($templateCache) {
  $templateCache.put('ng-range-picker.html', `
    <div class="daterange-picker">
      <div class="range-display">
        <div class="range-display-buttons" ng-hide="$picker.editable">
          <div class="btn-group" role="group">
            <button type="button" class="btn range-button {{ $picker.buttonClass }}"
                    ng-click="$picker.openFor('startDate')"
                    ng-class="{ 'btn-primary active': $picker.targetDate == 'startDate' }">
              {{ $picker.ngModel.startDate.format($picker.displayFormat) || $picker.startPlaceholder }}
            </button>
            <button type="button" class="btn range-button {{ $picker.buttonClass }}"
                    ng-click="$picker.openFor('endDate')"
                    ng-class="{ 'btn-primary active': $picker.targetDate == 'endDate' }">
              {{ $picker.ngModel.endDate.format($picker.displayFormat) || $picker.endPlaceholder }}
            </button>
          </div>
          <div class="range-arrow"></div>
        </div>
        <div class="range-input" ng-show="$picker.editable">
          <input class="form-control {{ $picker.inputClass }}" type="text" ng-keyup="$picker.inputChanged($event)" ng-click="$event.stopPropagation(); $picker.openFor('startDate')" value="{{ $picker.inputValue() }}" placeholder="{{ $picker.startPlaceholder + $picker.separator + $picker.endPlaceholder }}" />
        </div>
      </div>
      <div class="range-display-calendar {{$picker.placement}}" id="{{$picker._id}}" ng-class="{inline: $picker.inline}" ng-show="$picker.shown">
        <div class="range-inputs form-inline">
          <range-picker-input id="startDate" ng-model="$picker.ngModel.startDate" format="$picker.displayFormat" placeholder="$picker.displayFormat"></range-picker-input>
          <range-picker-input id="endDate" ng-model="$picker.ngModel.endDate" format="$picker.displayFormat" placeholder="$picker.displayFormat"></range-picker-input>
          <div class="range-arrow"></div>
        </div>
        <div class="range-calendar-header year">
          <div class="arrow-left" ng-click="$picker.yearPagePrev()">
            <button type="button" class="btn btn-link btn-sm">&lt;</button>
          </div>
          <div class="header-val centered clickable" ng-click="$picker.switchView('years')" ng-hide="$picker.showYears">
            {{ $picker.displayDate.format($picker.yearFormat) }}
          </div>
          <div class="arrow-right" ng-click="$picker.yearPageNext()">
            <button type="button" class="btn btn-link btn-sm">&gt;</button>
          </div>
        </div>
        <div class="range-calendar-header month" ng-show="$picker.showDays">
          <div class="arrow-left" ng-click="$picker.prev('month')">
            <button type="button" class="btn btn-link btn-sm">&lt;</button>
          </div>
          <div class="header-val centered clickable" ng-click="$picker.switchView('months')">
            {{ $picker.displayDate.format($picker.monthFormat) }}
          </div>
          <div class="arrow-right" ng-click="$picker.next('month')">
            <button type="button" class="btn btn-link btn-sm">&gt;</button>
          </div>
        </div>
        <div class="range-calendar-body days" ng-show="$picker.showDays">
          <div class="dayName" ng-repeat="dayLabel in $picker.dayLabels track by dayLabel">
            {{ dayLabel }}
          </div>
          <div class="calendar-day clickable"
               ng-repeat="day in $picker.days track by $index"
               ng-click="$picker.selectDay(day)"
               ng-class="{ 'start': day.isStart, 'end': day.isEnd, 'selected': day.inRange || day.isStart || day.isEnd, 'current': day.isCurrent, invalid: !day.isValid }">
            <div class="day centered" ng-class="{'off-month': day.value <= 0 || day.value > $picker.daysInMonth}">
              {{ day.label }}
            </div>
          </div>
        </div>
        <div class="range-calendar-body months" ng-show="$picker.showMonths">
          <div class="calendar-month clickable"
               ng-repeat="month in $picker.months track by $index"
               ng-click="$picker.selectMonth(month)"
               ng-class="{ 'start': month.isStart, 'end': month.isEnd, 'selected': month.inRange || month.isStart || month.isEnd, current: month.isCurrent, invalid: !month.isValid }">
            <div class="month centered">
              {{ month.label }}
            </div>
          </div>
        </div>
        <div class="range-calendar-body years" ng-show="$picker.showYears">
          <div class="calendar-year clickable"
               ng-repeat="year in $picker.years track by $index"
               ng-click="$picker.selectYear(year)"
               ng-class="{ 'start': year.isStart, 'end': year.isEnd, 'selected': year.inRange || year.isStart || year.isEnd, current: year.isCurrent, invalid: !year.isValid }">
            <div class="year centered">
              {{ year.label }}
            </div>
          </div>
        </div>
        <button type="button" style="display: inline-block; margin:2px; width: calc(100% - 4px)" class="btn btn-success btn-block"
                ng-show="$picker.showDays && $picker.changedFromLast() && $picker.isValid()"
                ng-click="$picker.runChanged(true)">
          OK
        </button>
      </div>
    </div>
  `)
}])
.value('rangePickerConfig', {
  _currentId: 0,
  editable: false,
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
})
.component('rangePickerInput', {
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
  controller: function ($scope, $element, $timeout) {
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
  }
})
.component('rangePicker', {
  templateUrl: 'ng-range-picker.html',
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
  controller: function ($scope, $element, $timeout, rangePickerConfig) {
    this._id = 'range_picker_' + (++rangePickerConfig._currentId);
    this.calendarEl;
    this.inputEl = $element.find('.range-input input');
    this.setLastModel = () => {
      this.lastModel = { startDate: this.ngModel && this.ngModel.startDate, endDate: this.ngModel && this.ngModel.endDate };
    };
    this.setLastModel();
    this.editable = typeof this.editable == 'undefined' ? rangePickerConfig.editable : this.editable,
    this.placement = this.placement || rangePickerConfig.placement;
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
    this.showYears = false;
    
    // on component initialized
    this.$onInit = () => {
      if (this.inline) {
        this.openFor('startDate');
      }
      
      let startWatch = $scope.$watch('$picker.ngModel.startDate', (n, o) => {
        if (n && +n !== +o) {
          if (+moment(n).isAfter(moment(this.ngModel.endDate))) {
            this.ngModel.endDate = moment(this.ngModel.startDate);
          }
          this.getDays(moment(n));
        }
      });
      
      let endWatch = $scope.$watch('$picker.ngModel.endDate', (n, o) => {
        if (n && +n !== +o) {
          if (+moment(n).isBefore(moment(this.ngModel.startDate))) {
            this.ngModel.startDate = moment(this.ngModel.endDate);
          }
          this.getDays(moment(n));
        }
      });
      
      $scope.$on('$destroy', () => {
        startWatch();
        endWatch();
      });
    };
    
    // on component destroyed
    this.$onDestroy = () => {
      $(document).off('click.' + this._id, this.clickWatcher);
    };
    
    this.inputValue = () => {
      let ret = '';
      
      if (this.ngModel.startDate || this.ngModel.endDate) {
        if (this.ngModel.startDate) {
          ret += moment(this.ngModel.startDate).format(this.displayFormat);
        } else {
          ret += this.startPlaceholder;
        }
        
        ret += this.separator;
        
        if (this.ngModel.endDate) {
          ret += moment(this.ngModel.endDate).format(this.displayFormat);
        } else {
          ret += this.endPlaceholder;
        } 
      }
      
      return ret;
    };
    
    this.inputChanged = ($event) => {
      let [start, end] = $event.target.value.split(this.separator);
      start = moment(start);
      end = moment(end);
      
      if (start.isValid()) {
        this.ngModel.startDate = start;
      }
      
      if (end.isValid()) {
        this.ngModel.endDate = end;
      }
    };
    
    this.show = () => {
      this.shown = true;
      $(document).on('click.' + this._id, this.clickWatcher);
    };
    
    this.hide = () => {
      $(document).off('click.' + this._id, this.clickWatcher);
      $timeout(() => {
        if (!this.inline) {
          this.shown = false; 
        }
        this.targetDate = null;
      }, 60);
    };
    
    this.changedFromLast = () => {
      return !!this.ngModel && (+this.ngModel.startDate !== +this.lastModel.startDate) ||
            (+this.ngModel.endDate !== +this.lastModel.endDate);
    };
    
    this.openFor = (date) => {
      this.targetDate = date;
      this.displayDate = this.ngModel[this.targetDate] ? moment(this.ngModel[this.targetDate]) : moment();
      if (!this.displayDate.isValid()) {
        this.displayDate = moment();
      }
      this.switchView('days');
      this.showDays = true;
      this.show();
      
      this.calendarEl = $element.find('.range-display-calendar');
      this.displayEl = $element.find('.range-display');
      
      if (this.container) {
        this.container = angular.element(this.container);
        this.container.append(this.calendarEl.detach());

        this.calendarEl.css(this.positionCalendar());
        setTimeout(() => {
          this.calendarEl = this.container.find('#' + this._id);
          this.calendarEl.css(this.positionCalendar());
        });
      } else if (!this.inline) {
        this.calendarEl.css(this.positionCalendarRelative());
        setTimeout(() => {
          this.calendarEl = $element.find('#' + this._id);
          this.calendarEl.css(this.positionCalendarRelative());
        });
      }
    };
    
    this.switchView = (period) => {
      period = period.charAt(0).toUpperCase() + period.slice(1);
      this.showDays = false;
      this.showMonths = false;
      this.showYears = false;
      this['get' + period](this.displayDate);
      this['show' + period] = true;
    };
    
    this.setDate = (targetDate, date) => {
      this.ngModel = this.ngModel || {};
      this.ngModel[targetDate] = moment(date);
    };
    
    this.runChanged = (hide) => {
      if (this.changedFromLast()) {
        this.ngModel.startDate = moment(this.ngModel.startDate);
        this.ngModel.endDate = moment(this.ngModel.endDate);
        this.rangeChanged({ $range: this.ngModel });
        this.setLastModel();
        if (hide) {
          this.hide();
        }
      }
      this.inputEl.val(this.inputValue());
    };
    
    this.isValid = () => {
      return !!this.ngModel.startDate && !!this.ngModel.endDate;
    };
    
    this.selectDay = (day) => {
      if (!day.isValid) {
        return;
      }
      if (!this.targetDate) {
        this.targetDate = 'startDate';
      }
      this.setDate(this.targetDate, moment(this.displayDate).date(day.value));
      if (this.targetDate == 'startDate') {
        if (!this.ngModel.endDate || moment(this.ngModel.startDate).isAfter(moment(this.ngModel.endDate))) {
          this.setDate('endDate', moment(this.ngModel.startDate));
        }
        this.targetDate = 'endDate';
      } else {
        if (!this.ngModel.startDate || moment(this.ngModel.startDate).isAfter(this.ngModel.endDate)) {
          this.setDate('startDate', moment(this.ngModel.endDate));
          this.targetDate = 'endDate';
        } else {
          // if (!this.inline) {
          //   this.runChanged();
          // }
        }
      }
    };
    
    this.selectMonth = (month) => {
      this.displayDate = moment(this.displayDate).month(month.value);
      this.switchView('days');
    };
    
    this.selectYear = (year) => {
      this.displayDate = moment(this.displayDate).year(year.value);
      this.switchView('months');
    };
    
    this.chooseDisplay = (period, value) => {
      this.displayDate = moment(this.targetDate)[period](value);
    };
    
    this.next = (period) => {
      this.getDays(moment(this.displayDate).add(1, period));
    };
    
    this.prev = (period) => {
      this.getDays(moment(this.displayDate).subtract(1, period));
    };
    
    this.nextMonths = () => {
      this.getMonths(moment(this.displayDate).add(1, 'year'));
    };
    
    this.prevMonths = () => {
      this.getMonths(moment(this.displayDate).subtract(1, 'year'));
    };
    
    this.nextYears = () => {
      this.getYears(moment(this.displayDate).add(12, 'year'));
    };
    
    this.prevYears = () => {
      this.getYears(moment(this.displayDate).subtract(12, 'year'));
    };
    
    this.yearPagePrev = () => {
      if (this.showDays) {
        this.prev('years');
      } else if (this.showMonths) {
        this.prevMonths();
      } else {
        this.prevYears();
      }
    };
    
    this.yearPageNext = () => {
      if (this.showDays) {
        this.next('years');
      } else if (this.showMonths) {
        this.nextMonths();
      } else {
        this.nextYears();
      }
    };
    
    this.isValidDate = (date) => {
      if (this.minDate && moment(this.minDate).isAfter(date)) {
        return false;
      }
      if (this.maxDate && moment(this.maxDate).isBefore(date)) {
        return false;
      }
      return true;
    };
    
    this.getDays = (date) => {
      this.daysInMonth = moment(date).daysInMonth();
      let today = moment();
      let days = [];
      let startDay = moment(date).startOf('month').day();
      let displayedDays = this.daysInMonth + startDay;
      displayedDays += 7 - ((displayedDays % 7) || 7);
      for (var i = 0; i < displayedDays; i++) {
        let mo = moment(date).date(i - startDay + 1);
        days.push({
          value: i < startDay ? -(startDay - i) + 1 : i - startDay + 1,
          label: mo.format(this.dayFormat),
          isCurrent: mo.isSame(today, 'date'),
          isValid: this.isValidDate(moment(mo).startOf('day').hours(12)),
          isStart: mo.isSame(this.ngModel.startDate, 'date'),
          isEnd: mo.isSame(this.ngModel.endDate, 'date'),
          inRange: mo.isBefore(this.ngModel.endDate) && mo.isAfter(this.ngModel.startDate)
        });
      }
      this.days = days;
      this.displayDate = moment(date);
    };
    
    this.getMonths = (date) => {
      let today = moment();
      let startDay = moment(date).startOf('year');
      let months = [];
      for (var i = 0; i < 12; i++) {
        let mo = moment(startDay).add(i, 'months');
        months.push({
          value: i,
          label: mo.format(this.monthListFormat),
          isCurrent: mo.isSame(today, 'month'),
          isValid: this.isValidDate(moment(mo).startOf('day').hours(12)),
          isStart: mo.isSame(this.ngModel.startDate, 'month'),
          isEnd: mo.isSame(this.ngModel.endDate, 'month'),
          inRange: mo.isBefore(this.ngModel.endDate) && mo.isAfter(this.ngModel.startDate)
        });
      }
      this.months = months;
      this.displayDate = moment(date);
    };
    
    this.getYears = (date) => {
      let today = moment();
      let startDay = moment(date).startOf('year').subtract(moment(date).year() % 10, 'years');
      let years = [];
      for (var i = 0; i < 12; i++) {
        let mo = moment(startDay).add(i, 'year');
        years.push({
          value: mo.year(),
          label: mo.format(this.yearFormat),
          isCurrent: mo.isSame(today, 'year'),
          isValid: this.isValidDate(moment(mo).startOf('day').hours(12)),
          isStart: mo.isSame(this.ngModel.startDate, 'year'),
          isEnd: mo.isSame(this.ngModel.endDate, 'year'),
          inRange: mo.isBefore(this.ngModel.endDate) && mo.isAfter(this.ngModel.startDate)
        });
      }
      this.years = years;
      this.displayDate = moment(date);
    };
    
    this.positionCalendar = () => {
      this.displayEl = $element.find('.range-display');
      this.calendarEl = this.container.find('#' + this._id);
      
      let tRect = this.container[0].getBoundingClientRect();
      let bRect = document.body.getBoundingClientRect();
      
      let offsetTop = tRect.top - bRect.top;
      let offsetRight = tRect.right - bRect.right;
      let offsetBottom = tRect.bottom - bRect.bottom;
      let offsetLeft = tRect.left - bRect.left;
      
      let dRect = this.displayRect = this.displayEl[0].getBoundingClientRect();
      let cRect = this.calendarRect = this.calendarEl[0].getBoundingClientRect();
      
      let split = this.placement.split('-');
      let pos = split[0];
      let aug = split[1];
      let position = {};
      
      switch(pos) {
        case 'top':
          position.top = dRect.top - offsetTop - cRect.height;
          break;
        case 'right':
          position.left = dRect.right - offsetLeft;
          break;
        case 'bottom':
          position.top = dRect.bottom - offsetTop;
          break;
        case 'left':
          position.left = dRect.left - offsetLeft - cRect.width - 1;
          break;
      }
      
      if (!aug) {
        switch(pos) {
          case 'top':
          case 'bottom':
            position.left = dRect.left - offsetLeft + (dRect.width - cRect.width) / 2;
            break;
          case 'right':
          case 'left':
            position.top = dRect.top - offsetTop + (dRect.height - cRect.height) / 2;
            break;
        }
      } else {
        switch(aug) {
          case 'top':
            position.top = dRect.top - offsetTop - cRect.height + dRect.height;
            break;
          case 'right':
            position.left = dRect.left - offsetLeft + dRect.width - cRect.width;
            break;
          case 'bottom':
            position.top = dRect.top + offsetTop;
            break;
          case 'left':
            position.left = dRect.left - offsetLeft;
            break;
        }
      }
      
      if (position.hasOwnProperty('top')) {
        position.top += this.offsetTop;
      } else if (position.hasOwnProperty('left')) {
        position.left += this.offsetLeft;
      } else if (position.hasOwnProperty('bottom')) {
        position.bottom += this.offsetBottom;
      } else if (position.hasOwnProperty('right')) {
        position.right += this.offsetRight;
      }
      
      return position;
    };
    
    this.positionCalendarRelative = () => {
      this.displayEl = $element.find('.range-display');
      this.calendarEl = $element.find('#' + this._id);
      
      let dRect = this.displayRect = this.displayEl[0].getBoundingClientRect();
      let cRect = this.calendarRect = this.calendarEl[0].getBoundingClientRect();
      
      let split = this.placement.split('-');
      let pos = split[0];
      let aug = split[1];
      let position = {};
      
      switch(pos) {
        case 'top':
          position.bottom = dRect.height;
          break;
        case 'right':
          position.left = '100%';
          break;
        case 'bottom':
          position.top = dRect.height;
          break;
        case 'left':
          position.right = '100%';
          break;
      }
      
      if (!aug) {
        switch(pos) {
          case 'top':
          case 'bottom':
            position.left = (dRect.width - cRect.width) / 2;
            break;
          case 'right':
          case 'left':
            position.top = (dRect.height - cRect.height) / 2;
            break;
        }
      } else {
        switch(aug) {
          case 'top':
            position.top = dRect.top - cRect.height + dRect.height;
            break;
          case 'right':
            position.right = 0;
            break;
          case 'bottom':
            position.top = dRect.top;
            break;
          case 'left':
            position.left = 0;
            break;
        }
      }
      
      if (position.hasOwnProperty('top')) {
        position.top += this.offsetTop;
      } else if (position.hasOwnProperty('left')) {
        position.left += this.offsetLeft;
      } else if (position.hasOwnProperty('bottom')) {
        position.bottom += this.offsetBottom;
      } else if (position.hasOwnProperty('right')) {
        position.right += this.offsetRight;
      }
      
      return position;
    };
    
    this.clickWatcher = (e) => {
      if (this.container) {
        this.calendarEl = this.container.find('#' + this._id); 
      }
      if (this.shown && !this.clickedInside(e.target, this.displayEl[0], this.calendarEl[0])) {
        this.hide();
      }
    };
    
    this.clickedInside = (t, e, o) => {
      let has = t === e || t == o;
      while (t.parentElement) {
        if (t.parentElement === e || t.parentElement == o) {
          has = true;
          break;
        }
        t = t.parentElement;
      }
      return !!has;
    };
  }
});