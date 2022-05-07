import React, {useState, useEffect, createRef } from 'react';
import './datePicker.scss';


export default function DatePicker ({onChange}) {
    let oneDay = 60 * 60 * 24 * 1000;
    let todayTimestamp = Date.now() - (Date.now() % oneDay) + (new Date().getTimezoneOffset() * 1000 * 60);
    let date = new Date();
    const inputRef = createRef()

    const [ open, setOpen ] = useState(false);
    const [ selectedDay, setSelectedDay ] = useState('');
    const [ monthDetails, setMonthDetails ] = useState([]);
    const [year, setNewYear] = useState(date.getFullYear());
    const [month, setNewMonth] = useState(date.getMonth());
    
    useEffect(() => {
        setMonthDetails(getMonthDetails(year, month));
        setDateToInput(selectedDay);
    }, []);

    /**
     *  Core
     */

    const daysMap = [
        'Sunday', 
        'Monday', 
        'Tuesday', 
        'Wednesday', 
        'Thursday', 
        'Friday', 
        'Saturday'
    ];

    const monthMap = [
        'January', 
        'February', 
        'March', 
        'April', 
        'May', 
        'June', 
        'July', 
        'August', 
        'September', 
        'October', 
        'November', 
        'December'
    ];

    const getNumberOfDays =  (year, month) => {
        return 40 - new Date(year, month, 40).getDate();
    };

    const getDayDetails = ( args ) => {
        let date = args.index - args.firstDay; 
        let day = args.index%7;
        let prevMonth = args.month-1;
        let prevYear = args.year;
        if(prevMonth < 0) {
            prevMonth = 11;
            prevYear--;
        }
        let prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth);
        let _date = (date < 0 ? prevMonthNumberOfDays+date : date % args.numberOfDays) + 1;
        let month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
        let timestamp = new Date(args.year, args.month, _date).getTime();
        return {
            date: _date,
            day,
            month, 
            timestamp,
            dayString: daysMap[day]
        }
    }
    
    const getMonthDetails = (year, month) => {
        let firstDay = (new Date(year, month)).getDay();
        let numberOfDays = getNumberOfDays(year, month);
        let monthArray = [];
        let rows = 6;
        let currentDay = null;
        let index = 0; 
        let cols = 7;
        for(let row=0; row<rows; row++) {
            for(let col=0; col<cols; col++) { 
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

    const isCurrentDay = (day) => {
        return day.timestamp === todayTimestamp;
    };

    const isSelectedDay = (day) => {
        return day.timestamp === selectedDay
    }; 

    const getDateFromDateString = (dateValue) => {
        let dateData = dateValue.split('-').map(d=>parseInt(d, 10));
        if(dateData.length < 3) 
            return null;
        let year = dateData[0];
        let month = dateData[1];
        let date = dateData[2];
        return {year, month, date};
    }

    const getMonthStr = (month) => {
        return monthMap[Math.max(Math.min(11, month), 0)] || 'Month';
    };

    const getDateStringFromTimestamp = (timestamp) => {
        let dateObject = new Date(timestamp);
        let month = dateObject.getMonth()+1;
        let date = dateObject.getDate();
        return dateObject.getFullYear() + '-' + (month < 10 ? '0'+month : month) + '-' + (date < 10 ? '0'+date : date);
    };

    const setDate = (dateData) => {
        let selectedDay = new Date(dateData.year, dateData.month-1, dateData.date).getTime();
        setSelectedDay()
        if(onChange) {
            onChange(selectedDay);
        }
    }

    const updateDateFromInput = () => {
        let dateValue = inputRef.current.value;
        let dateData = getDateFromDateString(dateValue);
        if(dateData !== null) { 
            setDate(dateData);
            setNewYear(dateData.year);
            setNewMonth(dateData.month-1); 
            setMonthDetails(getMonthDetails(dateData.year, dateData.month-1))
        }
    };

    const setDateToInput = (timestamp) => {
        let dateString = getDateStringFromTimestamp(timestamp);
        inputRef.current.value = dateString;
    }


    const onDateClick = (day) => {
        setSelectedDay(day.timestamp); 
        setDateToInput(day.timestamp);
        if(onChange) {
            onChange(day.timestamp);
        }
    };

    const setYear = (offset) => {
        let yearState = year + offset;
        let monthState =  month;
        setNewYear(yearState)
        setMonthDetails(getMonthDetails(yearState, monthState))
    };

    const setMonth = (offset) => {
        let yearState = year;
        let monthState =  month + offset;
        if(month === -1) {
            monthState = 11;
            yearState--;
        } else if(month === 12) {
            monthState = 0;
            yearState++;
        }
        setNewYear(yearState)
        setNewMonth(monthState)
        setMonthDetails(getMonthDetails(yearState, monthState))
    }

    /**
     *  Renderers
     */

    const renderCalendar = () => {
        let days = monthDetails.map((day, index)=> {
            return (
                <div className={'c-day-container ' + (day.month !== 0 ? ' disabled' : '') + 
                    (isCurrentDay(day) ? ' highlight' : '') + (isSelectedDay(day) ? ' highlight-blue' : '')} key={index}>
                    <div className='cdc-day'>
                        <span onClick={()=> onDateClick(day)}>
                            {day.date}
                        </span>
                    </div>
                </div>
            )
        })

        return (
            <div className='c-container'>
                <div className='cc-head'>
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d,i)=><div key={i} className='cch-name'>{d}</div>)}
                </div>
                <div className='cc-body'>
                    {days}
                </div>
            </div>
        )
    }


    return (
        <div className='datePicker-container'>
            <div className='dp-input'  onClick={()=> setOpen(!open)}>
                <input 
                    type='date' 
                    ref={inputRef}
                    onChange={updateDateFromInput}
                />
            </div>
            {open ? (
                <div className='dp-container'>
                    <div className='dpc-head'>
                        <div className='dpch-button'>
                            <div className='dpchb-inner' onClick={()=> setYear(-1)}>
                                <span className='dpchbi-left-arrows'></span>
                            </div>
                        </div>
                        <div className='dpch-button'>
                            <div className='dpchb-inner' onClick={()=> setMonth(-1)}>
                                <span className='dpchbi-left-arrow'></span>
                            </div>
                        </div>
                        <div className='dpch-container'>
                            <div className='dpchc-year'>{year}</div>
                            <div className='dpchc-month'>{getMonthStr(month)}</div>
                        </div>
                        <div className='dpch-button'>
                            <div className='dpchb-inner' onClick={()=> setMonth(1)}>
                                <span className='dpchbi-right-arrow'></span>
                            </div>
                        </div>
                        <div className='dpch-button'>
                            <div className='dpchb-inner' onClick={()=> setYear(1)}>
                                <span className='dpchbi-right-arrows'></span>
                            </div>
                        </div>
                    </div>
                    <div className='dpc-body' onClick={()=> setOpen(!open)}>
                        {renderCalendar()}
                    </div>
                </div>
            ) : ''}
        </div>
    )
}
