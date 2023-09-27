import '@/scenes/HandleRequests.css'
import '@/scenes/MyRequests.css'
import React,{ useState, useEffect } from 'react'
import { db } from "@/firebaseSetup";
import { collection, query, getDoc, getDocs, orderBy, setDoc, doc, where  } from "firebase/firestore";
import { Request, Employee } from '@/types';
import { getBusinessDays } from '@/utils/helpers';
import firebase from "firebase/compat/app"; // for User props typing
import Dropdown, { Option } from "react-dropdown";
import SearchBar from '@/components/SearchBar';

interface MyRequestsProps {
  user?: firebase.User | null;
}

function HandleRequests({user}: MyRequestsProps) {
  const [checkedRequests, setCheckedRequests] = useState(false);
  const [requests, setRequests] = useState<Request[] | []>([]);
  const [rows, setRows] = useState<React.ReactNode[] | []>([]);

  const subtractPTO = async (id: string, amount: number) => {
    const docSnap = await getDoc(doc(db, "Employees", id));
    
    if (docSnap.exists()) {
      const employee = docSnap.data() as Employee;
      try {
        await setDoc(doc(db, "Employees", id), {
          ...docSnap.data(),
          remaining_pto: employee.remaining_pto - amount,
          used_pto: employee.used_pto + amount
        })
      } catch (error) {
        console.log(error)
      }
    }
  }

  const addPTO = async (id: string, amount: number) => {
    const docSnap = await getDoc(doc(db, "Employees", id));
    
    if (docSnap.exists()) {
      const employee = docSnap.data() as Employee;
      try {
        await setDoc(doc(db, "Employees", id), {
          ...docSnap.data(),
          remaining_pto: employee.remaining_pto + amount,
          used_pto: employee.used_pto - amount
        })
      } catch (error) {
        console.log(error)
      }
    }
  }

  const changeStatus = async (option: Option, req: Request) => {
    try {
      await setDoc(doc(db, "Requests", req!.id), {
        ...req,
        status: option.value.toLowerCase()
      })

      if (option.value.toLowerCase() === 'approved' && req.status.toLowerCase() !== 'approved') {
        subtractPTO(req.employee_id, getBusinessDays(req.start_date, req.end_date))
      }
      console.log(option.value, req.status)
      if (option.value.toLowerCase() !== 'approved' && req.status.toLowerCase() === 'approved') {
        addPTO(req.employee_id, getBusinessDays(req.start_date, req.end_date))
      }
      fetchRequests();
    } catch (error) {
      console.log(error)
    }

  }

  const buildRows = (reqs: Request[]) => {
    if (reqs.length === 0) {
      setRows([])
      return
    }
    let tempRows:React.ReactNode[] = [];

    reqs.map((req: Request, mapIdx) => {
      tempRows.push(
        <div className="handle-requests-row" key={`row-${mapIdx}`}>
          <span className="handle-requests-row-item">{req.full_name}</span>
          <ul className={`status-item ${req.status}`}>
            <li className="handle-requests-row-item">
              <Dropdown 
                options={['Approved', 'Pending', 'Rejected']}
                placeholder={req.status.toUpperCase()[0] + req.status.slice(1)}
                onChange={(option) => changeStatus(option, req)}
              />
            </li>
          </ul>
          <span className="handle-requests-row-item">{req.type}</span>
          <span className="handle-requests-row-item">{req.start_date}</span>
          <span className="handle-requests-row-item">{req.end_date}</span>
          <span className="handle-requests-row-item">{getBusinessDays(req.start_date, req.end_date)}</span>
        </div>
      )
    })
    setRows(tempRows);
  }

  async function fetchRequests() {
    let currentUser = {} as Employee;

    const employeeRef = collection(db, "Employees");
    const employeeSnapshot = await getDocs(employeeRef); 
    let tempEmployeeArray:Employee[] = []
    employeeSnapshot.forEach((doc) => {
        const employee = doc.data() as Employee;
        tempEmployeeArray.push(employee)
        if (user?.uid === employee.employee_id) {
          currentUser = employee
        }
    });
    
    if (currentUser === null) return
    const requestsRef = collection(db, "Requests");
    const q = query(requestsRef, where("approver", "==", `${currentUser.first_name} ${currentUser.last_name}`), orderBy("start_date", "asc"))
    const requestSnapshot = await getDocs(q); 
    let tempRequestArray:Request[] = []
    requestSnapshot.forEach((doc) => {
      tempRequestArray.push(doc.data() as Request)
    });

    let updatedTempArray = tempRequestArray.map((req) => {
      const employee = tempEmployeeArray.filter((emp) => req.employee_id === emp.id)[0];
      req.full_name = `${employee.first_name} ${employee.last_name}`;
      return req
    })

    buildRows(updatedTempArray);
    setRequests(updatedTempArray);
    setCheckedRequests(true);
  }

  if (!checkedRequests) {
    fetchRequests();
  }
  
  useEffect(() => {
    fetchRequests();
  },[])

  return (
    <div className="handle-requests">
      <div className="handle-requests-heading">
        <h1>Handle Requests</h1>
        <SearchBar requests={requests} buildRows={buildRows} />
      </div>
      <div className="handle-requests-body">
        <div className="handle-requests-col-headers">
          <span className="request-col-header">Requested By</span>
          <span className="request-col-header">Status</span>
          <span className="request-col-header">Type</span>
          <span className="request-col-header">Date Start</span>
          <span className="request-col-header">Date End</span>
          <span className="request-col-header">Total Days</span>
        </div>
        {rows.length > 0?
          <div className="handle-requests-rows">
            {rows}
          </div>
        :
          <div className='no-results-found'>No Requests Found</div>
        }
      </div>
    </div>
  )
}

export default HandleRequests