import '@/scenes/Calendar.css'
import { isWithinInterval, eachDayOfInterval, endOfMonth, endOfWeek, format, getDay, isSameMonth, parse, startOfToday, startOfWeek, add, isWeekend } from 'date-fns';
import { useState, useEffect } from 'react'
import { collection, query, getDocs, orderBy} from "firebase/firestore";
import { db } from "@/firebaseSetup";
import { Employee, Request } from '@/types';
import firebase from "firebase/compat/app"; // used for interface types;

interface colorsType {
  [key: string]: string;
}
const typeColors: colorsType = {
  'Parental Leave': 'parental-leave',
  'Flex Leave': 'flex-leave',
  'Sick Leave': 'sick-leave'
}

interface CalendarProps {
  user: firebase.User | null
}

function Calendar({user}: CalendarProps) {
  let today = startOfToday();

  const [loaded, setLoaded] = useState(false);
  const [activeYear, setActiveYear] = useState(parseInt(format(today, 'yyyy')));
  const [activeMonth, setActiveMonth] = useState(format(today, 'MMM'));
  const [requests, setRequests] = useState<Request[] | []>([]);
  let firstDayCurrentMonth = parse(`${activeMonth}-${activeYear}`, 'MMM-yyyy', new Date());
  
  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth), 
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
    
  });

  let requestDays:any = [];
  
  if (requests) {
    for (let i = 0; i < days.length; i++) {
      let requestDay:any = [];
      requests.map((req) => {
        if (req.status !== 'approved') return
        if (!isWeekend(days[i]) && isWithinInterval(days[i], {
          start: new Date(req.start_date),
          end: add(new Date(req.end_date), { days: 1})
        })) {
          requestDay.push({
            name: req.full_name,
            type: req.type,
            color: req.color,
            employee_id: req.employee_id
          })
        }
      })
      requestDays.push(requestDay) 
    }
  }
  const getDateColumn = (day: Date, dayIdx: number) => {
    if (dayIdx === 0) {
      const startColumn = getDay(day) + 1
      return `date col-${startColumn}`
    }
    return 'date'
  }

  const fetchRequests = async () => {
    const requestsRef = collection(db, "Requests");
    const q = query(requestsRef, orderBy("start_date", "asc"))
    const requestSnapshot = await getDocs(q); 
    let tempRequestArray:Request[] = []
    requestSnapshot.forEach((doc) => {
        tempRequestArray.push(doc.data() as Request)
    });

    const employeeRef = collection(db, "Employees");
    const employeeSnapshot = await getDocs(employeeRef); 
    let tempEmployeeArray:Employee[] = []
    employeeSnapshot.forEach((doc) => {
        tempEmployeeArray.push(doc.data() as Employee)
    });

    if (tempEmployeeArray.length > 0 && tempRequestArray.length > 0) {
      let updatedTempArray = tempRequestArray.map((req) => {
        const employee = tempEmployeeArray.filter((emp) => req.employee_id === emp.id)[0];
        req.full_name = `${employee.first_name} ${employee.last_name}`;
        req.color = employee.color
        req.employee_id = employee.id
        return req
      })
      setRequests(updatedTempArray)
    }
    setLoaded(true);
  }


  useEffect(() => {
    if (!user) {
      setLoaded(true)
      return
    }
    fetchRequests();
  }, [user])
  
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
        {loaded? <div className="days">
          {days.map((day, dayIdx) => (
            <div className={getDateColumn(day,dayIdx)} key={day.toString()}>
              <time className={`${!isSameMonth(day, firstDayCurrentMonth)? 'preview-date': ''}`} dateTime={format(day, 'yyyy-M-dd')}>
                {format(day, 'd')}
              </time>
              {requestDays[dayIdx].length> 0? 
                <div className='days-requests'>{requestDays[dayIdx].map((req:any) => {
                  return  <div className="days-request" key={`request-${dayIdx}-${req.employee_id}`}>
                              <span className={`days-request-name`} style={{backgroundColor: req.color}}>{req.name}</span>
                              <span className={`days-request-type ${typeColors[req.type]}`}>{req.type[0]}</span>
                          </div>
                
              })}</div>: <span></span>}
            </div>
          ))}
        </div>:
        <h1></h1>}
      </div>
    </div>
  )
}

export default Calendar