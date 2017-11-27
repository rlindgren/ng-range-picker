module.exports = {
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
};