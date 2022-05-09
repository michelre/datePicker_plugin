"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DatePicker;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.parse-int.js");

var _react = _interopRequireWildcard(require("react"));

require("./datePicker.css");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function DatePicker(_ref) {
  let {
    onChange
  } = _ref;
  let oneDay = 60 * 60 * 24 * 1000;
  let todayTimestamp = Date.now() - Date.now() % oneDay + new Date().getTimezoneOffset() * 1000 * 60;
  let date = new Date();
  const inputRef = /*#__PURE__*/(0, _react.createRef)();
  const [open, setOpen] = (0, _react.useState)(false);
  const [selectedDay, setSelectedDay] = (0, _react.useState)('');
  const [monthDetails, setMonthDetails] = (0, _react.useState)([]);
  const [year, setNewYear] = (0, _react.useState)(date.getFullYear());
  const [month, setNewMonth] = (0, _react.useState)(date.getMonth());
  (0, _react.useEffect)(() => {
    setMonthDetails(getMonthDetails(year, month));
    setDateToInput(selectedDay);
  }, []);
  /**
   *  Core
   */

  const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthMap = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const getNumberOfDays = (year, month) => {
    return 40 - new Date(year, month, 40).getDate();
  };

  const getDayDetails = args => {
    let date = args.index - args.firstDay;
    let day = args.index % 7;
    let prevMonth = args.month - 1;
    let prevYear = args.year;

    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear--;
    }

    let prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth);

    let _date = (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;

    let month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
    let timestamp = new Date(args.year, args.month, _date).getTime();
    return {
      date: _date,
      day,
      month,
      timestamp,
      dayString: daysMap[day]
    };
  };

  const getMonthDetails = (year, month) => {
    let firstDay = new Date(year, month).getDay();
    let numberOfDays = getNumberOfDays(year, month);
    let monthArray = [];
    let rows = 6;
    let currentDay = null;
    let index = 0;
    let cols = 7;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        currentDay = getDayDetails({
          index,
          numberOfDays,
          firstDay,
          year,
          month
        });
        monthArray.push(currentDay);
        index++;
      }
    }

    return monthArray;
  };

  const isCurrentDay = day => {
    return day.timestamp === todayTimestamp;
  };

  const isSelectedDay = day => {
    return day.timestamp === selectedDay;
  };

  const getDateFromDateString = dateValue => {
    let dateData = dateValue.split('-').map(d => parseInt(d, 10));
    if (dateData.length < 3) return null;
    let year = dateData[0];
    let month = dateData[1];
    let date = dateData[2];
    return {
      year,
      month,
      date
    };
  };

  const getMonthStr = month => {
    return monthMap[Math.max(Math.min(11, month), 0)] || 'Month';
  };

  const getDateStringFromTimestamp = timestamp => {
    let dateObject = new Date(timestamp);
    let month = dateObject.getMonth() + 1;
    let date = dateObject.getDate();
    return dateObject.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date);
  };

  const setDate = dateData => {
    let selectedDay = new Date(dateData.year, dateData.month - 1, dateData.date).getTime();
    setSelectedDay();

    if (onChange) {
      onChange(selectedDay);
    }
  };

  const updateDateFromInput = () => {
    let dateValue = inputRef.current.value;
    let dateData = getDateFromDateString(dateValue);

    if (dateData !== null) {
      setDate(dateData);
      setNewYear(dateData.year);
      setNewMonth(dateData.month - 1);
      setMonthDetails(getMonthDetails(dateData.year, dateData.month - 1));
    }
  };

  const setDateToInput = timestamp => {
    let dateString = getDateStringFromTimestamp(timestamp);
    inputRef.current.value = dateString;
  };

  const onDateClick = day => {
    setSelectedDay(day.timestamp);
    setDateToInput(day.timestamp);

    if (onChange) {
      onChange(day.timestamp);
    }
  };

  const setYear = offset => {
    let yearState = year + offset;
    let monthState = month;
    setNewYear(yearState);
    setMonthDetails(getMonthDetails(yearState, monthState));
  };

  const setMonth = offset => {
    let yearState = year;
    let monthState = month + offset;

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


  const renderCalendar = () => {
    let days = monthDetails.map((day, index) => {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: 'c-day-container ' + (day.month !== 0 ? ' disabled' : '') + (isCurrentDay(day) ? ' highlight' : '') + (isSelectedDay(day) ? ' highlight-blue' : ''),
        key: index
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "cdc-day"
      }, /*#__PURE__*/_react.default.createElement("span", {
        onClick: () => onDateClick(day)
      }, day.date)));
    });
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "c-container"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "cc-head"
    }, ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d, i) => /*#__PURE__*/_react.default.createElement("div", {
      key: i,
      className: "cch-name"
    }, d))), /*#__PURE__*/_react.default.createElement("div", {
      className: "cc-body"
    }, days));
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "datePicker-container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "dp-input",
    onClick: () => setOpen(!open)
  }, /*#__PURE__*/_react.default.createElement("input", {
    type: "date",
    ref: inputRef,
    onChange: updateDateFromInput
  })), open ? /*#__PURE__*/_react.default.createElement("div", {
    className: "dp-container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "dpc-head"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "dpch-button"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "dpchb-inner",
    onClick: () => setYear(-1)
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "dpchbi-left-arrows"
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: "dpch-button"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "dpchb-inner",
    onClick: () => setMonth(-1)
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "dpchbi-left-arrow"
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: "dpch-container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "dpchc-year"
  }, year), /*#__PURE__*/_react.default.createElement("div", {
    className: "dpchc-month"
  }, getMonthStr(month))), /*#__PURE__*/_react.default.createElement("div", {
    className: "dpch-button"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "dpchb-inner",
    onClick: () => setMonth(1)
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "dpchbi-right-arrow"
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: "dpch-button"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "dpchb-inner",
    onClick: () => setYear(1)
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "dpchbi-right-arrows"
  })))), /*#__PURE__*/_react.default.createElement("div", {
    className: "dpc-body",
    onClick: () => setOpen(!open)
  }, renderCalendar())) : '');
}