'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.DatePicker = DatePicker;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./datePicker.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DatePicker(_ref) {
    var onChange = _ref.onChange;

    var oneDay = 60 * 60 * 24 * 1000;
    var todayTimestamp = Date.now() - Date.now() % oneDay + new Date().getTimezoneOffset() * 1000 * 60;
    var date = new Date();
    var inputRef = (0, _react.createRef)();

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        open = _useState2[0],
        setOpen = _useState2[1];

    var _useState3 = (0, _react.useState)(''),
        _useState4 = _slicedToArray(_useState3, 2),
        selectedDay = _useState4[0],
        setSelectedDay = _useState4[1];

    var _useState5 = (0, _react.useState)([]),
        _useState6 = _slicedToArray(_useState5, 2),
        monthDetails = _useState6[0],
        setMonthDetails = _useState6[1];

    var _useState7 = (0, _react.useState)(date.getFullYear()),
        _useState8 = _slicedToArray(_useState7, 2),
        year = _useState8[0],
        setNewYear = _useState8[1];

    var _useState9 = (0, _react.useState)(date.getMonth()),
        _useState10 = _slicedToArray(_useState9, 2),
        month = _useState10[0],
        setNewMonth = _useState10[1];

    (0, _react.useEffect)(function () {
        setMonthDetails(getMonthDetails(year, month));
        setDateToInput(selectedDay);
    }, []);

    /**
     *  Core
     */

    var daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    var monthMap = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var getNumberOfDays = function getNumberOfDays(year, month) {
        return 40 - new Date(year, month, 40).getDate();
    };

    var getDayDetails = function getDayDetails(args) {
        var date = args.index - args.firstDay;
        var day = args.index % 7;
        var prevMonth = args.month - 1;
        var prevYear = args.year;
        if (prevMonth < 0) {
            prevMonth = 11;
            prevYear--;
        }
        var prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth);
        var _date = (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;
        var month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
        var timestamp = new Date(args.year, args.month, _date).getTime();
        return {
            date: _date,
            day: day,
            month: month,
            timestamp: timestamp,
            dayString: daysMap[day]
        };
    };

    var getMonthDetails = function getMonthDetails(year, month) {
        var firstDay = new Date(year, month).getDay();
        var numberOfDays = getNumberOfDays(year, month);
        var monthArray = [];
        var rows = 6;
        var currentDay = null;
        var index = 0;
        var cols = 7;
        for (var row = 0; row < rows; row++) {
            for (var col = 0; col < cols; col++) {
                currentDay = getDayDetails({
                    index: index,
                    numberOfDays: numberOfDays,
                    firstDay: firstDay,
                    year: year,
                    month: month
                });
                monthArray.push(currentDay);
                index++;
            }
        }
        return monthArray;
    };

    var isCurrentDay = function isCurrentDay(day) {
        return day.timestamp === todayTimestamp;
    };

    var isSelectedDay = function isSelectedDay(day) {
        return day.timestamp === selectedDay;
    };

    var getDateFromDateString = function getDateFromDateString(dateValue) {
        var dateData = dateValue.split('-').map(function (d) {
            return parseInt(d, 10);
        });
        if (dateData.length < 3) return null;
        var year = dateData[0];
        var month = dateData[1];
        var date = dateData[2];
        return { year: year, month: month, date: date };
    };

    var getMonthStr = function getMonthStr(month) {
        return monthMap[Math.max(Math.min(11, month), 0)] || 'Month';
    };

    var getDateStringFromTimestamp = function getDateStringFromTimestamp(timestamp) {
        var dateObject = new Date(timestamp);
        var month = dateObject.getMonth() + 1;
        var date = dateObject.getDate();
        return dateObject.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date);
    };

    var setDate = function setDate(dateData) {
        var selectedDay = new Date(dateData.year, dateData.month - 1, dateData.date).getTime();
        setSelectedDay();
        if (onChange) {
            onChange(selectedDay);
        }
    };

    var updateDateFromInput = function updateDateFromInput() {
        var dateValue = inputRef.current.value;
        var dateData = getDateFromDateString(dateValue);
        if (dateData !== null) {
            setDate(dateData);
            setNewYear(dateData.year);
            setNewMonth(dateData.month - 1);
            setMonthDetails(getMonthDetails(dateData.year, dateData.month - 1));
        }
    };

    var setDateToInput = function setDateToInput(timestamp) {
        var dateString = getDateStringFromTimestamp(timestamp);
        inputRef.current.value = dateString;
    };

    var onDateClick = function onDateClick(day) {
        setSelectedDay(day.timestamp);
        setDateToInput(day.timestamp);
        if (onChange) {
            onChange(day.timestamp);
        }
    };

    var setYear = function setYear(offset) {
        var yearState = year + offset;
        var monthState = month;
        setNewYear(yearState);
        setMonthDetails(getMonthDetails(yearState, monthState));
    };

    var setMonth = function setMonth(offset) {
        var yearState = year;
        var monthState = month + offset;
        if (month === -1) {
            monthState = 11;
            yearState--;
        } else if (month === 12) {
            monthState = 0;
            yearState++;
        }
        setNewYear(yearState);
        setNewMonth(monthState);
        setMonthDetails(getMonthDetails(yearState, monthState));
    };

    /**
     *  Renderers
     */

    var renderCalendar = function renderCalendar() {
        var days = monthDetails.map(function (day, index) {
            return _react2.default.createElement(
                'div',
                { className: 'c-day-container ' + (day.month !== 0 ? ' disabled' : '') + (isCurrentDay(day) ? ' highlight' : '') + (isSelectedDay(day) ? ' highlight-blue' : ''), key: index },
                _react2.default.createElement(
                    'div',
                    { className: 'cdc-day' },
                    _react2.default.createElement(
                        'span',
                        { onClick: function onClick() {
                                return onDateClick(day);
                            } },
                        day.date
                    )
                )
            );
        });

        return _react2.default.createElement(
            'div',
            { className: 'c-container' },
            _react2.default.createElement(
                'div',
                { className: 'cc-head' },
                ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(function (d, i) {
                    return _react2.default.createElement(
                        'div',
                        { key: i, className: 'cch-name' },
                        d
                    );
                })
            ),
            _react2.default.createElement(
                'div',
                { className: 'cc-body' },
                days
            )
        );
    };

    return _react2.default.createElement(
        'div',
        { className: 'datePicker-container' },
        _react2.default.createElement(
            'div',
            { className: 'dp-input', onClick: function onClick() {
                    return setOpen(!open);
                } },
            _react2.default.createElement('input', {
                type: 'date',
                ref: inputRef,
                onChange: updateDateFromInput
            })
        ),
        open ? _react2.default.createElement(
            'div',
            { className: 'dp-container' },
            _react2.default.createElement(
                'div',
                { className: 'dpc-head' },
                _react2.default.createElement(
                    'div',
                    { className: 'dpch-button' },
                    _react2.default.createElement(
                        'div',
                        { className: 'dpchb-inner', onClick: function onClick() {
                                return setYear(-1);
                            } },
                        _react2.default.createElement('span', { className: 'dpchbi-left-arrows' })
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'dpch-button' },
                    _react2.default.createElement(
                        'div',
                        { className: 'dpchb-inner', onClick: function onClick() {
                                return setMonth(-1);
                            } },
                        _react2.default.createElement('span', { className: 'dpchbi-left-arrow' })
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'dpch-container' },
                    _react2.default.createElement(
                        'div',
                        { className: 'dpchc-year' },
                        year
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'dpchc-month' },
                        getMonthStr(month)
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'dpch-button' },
                    _react2.default.createElement(
                        'div',
                        { className: 'dpchb-inner', onClick: function onClick() {
                                return setMonth(1);
                            } },
                        _react2.default.createElement('span', { className: 'dpchbi-right-arrow' })
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'dpch-button' },
                    _react2.default.createElement(
                        'div',
                        { className: 'dpchb-inner', onClick: function onClick() {
                                return setYear(1);
                            } },
                        _react2.default.createElement('span', { className: 'dpchbi-right-arrows' })
                    )
                )
            ),
            _react2.default.createElement(
                'div',
                { className: 'dpc-body', onClick: function onClick() {
                        return setOpen(!open);
                    } },
                renderCalendar()
            )
        ) : ''
    );
}