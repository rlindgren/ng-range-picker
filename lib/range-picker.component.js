module.exports = {
  template: require("./range-picker.component.html"),
  bindings: {
    name: '@',
    ngModel: '=',
    editable: '<',
    placement: '@',
    separator: '@',
    placeholder: '@',
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
  controller: ['$scope', '$element', '$timeout', '$rootScope', 'rangePickerConfig', 'rangePickerDelegate', function ($scope, $element, $timeout, $rootScope, rangePickerConfig, rangePickerDelegate) {

    this._id = 'range_picker_' + (++rangePickerConfig._currentId);
    this._tether = null;
    this.calendarEl;
    this.inputEl = $element.find('.nrp-range-input input');
    this.setLastModel = () => {
      this.lastModel = { startDate: this.ngModel && this.ngModel.startDate && moment(this.ngModel.startDate), endDate: this.ngModel && this.ngModel.endDate && moment(this.ngModel.endDate) };
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

    this.noop = () => {};

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
        this.hide();
        startWatch();
        endWatch();
        try {
          $('#' + this._id).remove();
        } catch(e) {}
      });
    };

    // on component destroyed
    this.$onDestroy = () => {
      $(document.body).off('click.' + this._id, this.clickWatcher);
      if (this._tether) {
        this._tether.destroy();
      }
      try {
        $('#' + this._id).remove();
      } catch(e) {}
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
      rangePickerDelegate.add(this);
      this.shown = true;
      $(document.body).on('click.' + this._id, this.clickWatcher);
    };

    this.hide = () => {
      rangePickerDelegate.remove(this);
      $(document.body).off('click.' + this._id, this.clickWatcher);
      if (this.ngModel) {
        this.ngModel.startDate = this.lastModel.startDate;
        this.ngModel.endDate = this.lastModel.endDate;
      }
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
      rangePickerDelegate.hideAllExcept(this);
      this.targetDate = date;
      this.displayDate = this.ngModel[this.targetDate] ? moment(this.ngModel[this.targetDate]) : moment();
      if (!this.displayDate.isValid()) {
        this.displayDate = moment();
      }
      this.switchView('days');
      this.showDays = true;
      this.show();

      this.calendarEl = $element.find('.nrp-range-display-calendar');
      this.displayEl = $element.find('.nrp-range-display');

      if (!this.inline) {
        this.calendarEl = $element.find('#' + this._id);
        this.tether(this.calendarEl[0], this.displayEl[0]);
        setTimeout(() => this._tether.position());
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
      this.ngModel[targetDate] = date && moment(date);
    };

    this.setRange = (range) => {
      this.setDate('startDate', range.startDate);
      this.setDate('endDate', range.endDate);
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
      date = moment(date).hours(12).startOf('day').hours(12);
      this.daysInMonth = moment(date).daysInMonth();
      let today = moment();
      let days = [];
      let startDay = moment(date).startOf('month').day();
      let displayedDays = this.daysInMonth + startDay;
      displayedDays += 7 - ((displayedDays % 7) || 7);
      let start = moment(this.ngModel.startDate).hours(12).startOf('day').hours(12);
      let end = moment(this.ngModel.endDate).hours(12).startOf('day').hours(12);
      for (var i = 0; i < displayedDays; i++) {
        let mo = moment(date).date(i - startDay + 1);
        days.push({
          value: i < startDay ? -(startDay - i) + 1 : i - startDay + 1,
          label: mo.format(this.dayFormat),
          isCurrent: mo.isSame(today, 'day'),
          isValid: this.isValidDate(mo),
          isStart: mo.isSame(start, 'day'),
          isEnd: mo.isSame(end, 'day'),
          inRange: mo.isBefore(end) && mo.isAfter(start)
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

    this.tether = (e, t) => {
      if (this._tether) {
        this._tether.position();
        return;
      }

      var positions = {
        'top': ['bottom middle', 'top middle'],
        'bottom': ['top middle', 'bottom middle'],
        'left': ['middle right', 'middle left'],
        'right': ['middle left', 'middle right'],
        'top left': ['bottom left', this.placement],
        'top right': ['bottom right', this.placement],
        'bottom left': ['top left', this.placement],
        'bottom right': ['top right', this.placement],
        'left top': ['top right', 'top left'],
        'right top': ['top left', 'top right'],
        'left bottom': ['bottom right', 'bottom left'],
        'right bottom': ['bottom left', 'bottom right'],
      };

      let placement = positions[this.placement];

      this._tether = new Tether({
        element: e,
        target: t,
        attachment: placement ? placement[0] : 'top left',
        targetAttachment: placement ? placement[1] : 'bottom left',
        constraints: [
          {
            to: 'scrollParent',
            pin: true
          },
          {
            to: 'window',
            attachment: 'together'
          }
        ]
      });
    };

    this.clickWatcher = (e) => {
      this.calendarEl = $('#' + this._id);
      if (this.shown && !this.clickedInside(e.target, this.displayEl[0], this.calendarEl[0])) {
        this.hide();
      }
    };

    this.clickedInside = (t, e, o) => {
      let has = t === e || t === o;
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
