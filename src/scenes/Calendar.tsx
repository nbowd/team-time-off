import '@/scenes/Calendar.css'
import { eachDayOfInterval, endOfMonth, endOfWeek, format, getDay, isSameMonth, parse, startOfToday, startOfWeek } from 'date-fns';
import { useState } from 'react'

function Calendar() {
  let today = startOfToday();

  const [activeYear, setActiveYear] = useState(parseInt(format(today, 'yyyy')));
  const [activeMonth, setActiveMonth] = useState(format(today, 'MMM'));
  let firstDayCurrentMonth = parse(`${activeMonth}-${activeYear}`, 'MMM-yyyy', new Date());
  
  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth), 
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
    
  });


  const getDateColumn = (day: Date, dayIdx: number) => {
    if (dayIdx === 0) {
      const startColumn = getDay(day) + 1
      return `date col-${startColumn}`
    }
    return 'date'
  }
  
  return (
    <div className="calendar">
      <div className="calendar-heading">
        <div className="years">
          <span onClick={() => setActiveYear(activeYear-1)}>{activeYear - 1}</span>
          <span className='current-year'>{activeYear}</span>
          <span onClick={() => setActiveYear(activeYear+1)}>{activeYear + 1}</span>
        </div>
        <div className="months">
          <span onClick={() => setActiveMonth("Jan")} className={`${activeMonth === "Jan"? "current-month": ""}`}>Jan</span>
          <span onClick={() => setActiveMonth("Feb")} className={`${activeMonth === "Feb"? "current-month": ""}`}>Feb</span>
          <span onClick={() => setActiveMonth("Mar")} className={`${activeMonth === "Mar"? "current-month": ""}`}>Mar</span>
          <span onClick={() => setActiveMonth("Apr")} className={`${activeMonth === "Apr"? "current-month": ""}`}>Apr</span>
          <span onClick={() => setActiveMonth("May")} className={`${activeMonth === "May"? "current-month": ""}`}>May</span>
          <span onClick={() => setActiveMonth("Jun")} className={`${activeMonth === "Jun"? "current-month": ""}`}>Jun</span>
          <span onClick={() => setActiveMonth("Jul")} className={`${activeMonth === "Jul"? "current-month": ""}`}>Jul</span>
          <span onClick={() => setActiveMonth("Aug")} className={`${activeMonth === "Aug"? "current-month": ""}`}>Aug</span>
          <span onClick={() => setActiveMonth("Sep")} className={`${activeMonth === "Sep"? "current-month": ""}`}>Sep</span>
          <span onClick={() => setActiveMonth("Oct")} className={`${activeMonth === "Oct"? "current-month": ""}`}>Oct</span>
          <span onClick={() => setActiveMonth("Nov")} className={`${activeMonth === "Nov"? "current-month": ""}`}>Nov</span>
          <span onClick={() => setActiveMonth("Dec")} className={`${activeMonth === "Dec"? "current-month": ""}`}>Dec</span>
        </div>
        <div className="days-header">
          <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
        </div>
      </div>
      <div className="calendar-body">
        <div className="days">
          {days.map((day, dayIdx) => (
            <div className={getDateColumn(day,dayIdx)} key={day.toString()}>
              <time className={`${!isSameMonth(day, firstDayCurrentMonth)? 'preview-date': ''}`} dateTime={format(day, 'yyyy-M-dd')}>
                {format(day, 'd')}
              </time>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Calendar