import '@/scenes/MyRequests.css'
import React,{ useState, useEffect, useRef } from 'react'
import { db } from "@/firebaseSetup";
import { collection, query, where, getDocs, doc, deleteDoc, orderBy  } from "firebase/firestore";
import { Employee, Request } from '@/types';
import firebase from "firebase/compat/app"; // for User props typing
import editIcon from '@/assets/icons/icons8-pencil-30.png';
import trashIcon from '@/assets/icons/icons8-trash-50.png';
import Modal from '@/components/Modal';
import { getBusinessDays, getProfile } from '@/utils/helpers';
import { isBefore } from 'date-fns';

interface MyRequestsProps {
  user?: firebase.User | null;
}

function MyRequests({user}: MyRequestsProps) {
  const [profile, setProfile] = useState<Employee | null>(null);
  const [checkedRequests, setCheckedRequests] = useState(false);
  const [requests, setRequests] = useState<Request[] | []>([]);
  const [rows, setRows] = useState<React.ReactNode[] | []>([]);
  const [request, setRequest] = useState<Request>({
    id: "",
    employee_id: "",
    status: "",
    type: "",
    start_date: "",
    end_date: "",
    approver: ""
  });


  const requestModalRef = useRef<HTMLDialogElement>(null);

  const openEditModal = (req: Request) => {
    setRequest(req);
    requestModalRef.current?.showModal();

  }

  const deleteRequest = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return
    await deleteDoc(doc(db, "Requests", id))
    const filteredRequests = requests.filter(req => req.id !== id)
    setRequests(filteredRequests);
    buildRows(filteredRequests)
  }

  const buildRows = (reqs: Request[]) => {
    if (reqs.length === 0) {
      setRows([])
      return
    }
    let tempRows:React.ReactNode[] = [];

    reqs.map((req: Request, mapIdx) => {
      tempRows.push(
        <div className="my-requests-row" key={`row-${mapIdx}`}>
          <ul className={`status-item ${req.status}`}>
            <li className="my-requests-row-item">{req.status.toUpperCase()[0] + req.status.slice(1)}</li>
          </ul>
          <span className="my-requests-row-item">{req.approver}</span>
          <span className="my-requests-row-item">{req.type}</span>
          <span className="my-requests-row-item">{req.start_date}</span>
          <span className="my-requests-row-item">{req.end_date}</span>
          <div className="row-controls">
            <span className="my-requests-row-item">{getBusinessDays(req.start_date, req.end_date)}</span>
            <span className='row-control'>
              {isBefore(new Date(req.end_date), new Date())? <></>:<>
                <img src={editIcon} alt="pencil icon" className="row-icon" onClick={() => openEditModal(req)} />
                <img src={trashIcon} alt="delete icon" className="row-icon" onClick={() => deleteRequest(req.id)} />
              </>}
            </span>
          </div>
        </div>
      )
    })
    setRows(tempRows);
  }

  const fetchRequests = async () => {
    const currentUser = await getProfile(user!);

    const requestsRef = collection(db, "Requests");
    const q = query(requestsRef, where("employee_id", "==", `${currentUser.id}`), orderBy("start_date", "asc"))
    const querySnapshot = await getDocs(q); 
    let tempArray:Request[] = []
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
        tempArray.push(doc.data() as Request)
    });
    setProfile(currentUser);
    setRequests(tempArray);
    buildRows(tempArray);
    setCheckedRequests(true);
  }

  if (!checkedRequests) {
    fetchRequests();
  }
  
  useEffect(() => {
    fetchRequests();
  },[])

  return (
    <div className="my-requests">
      <Modal modalRef={requestModalRef} request={request} profile={profile} type={'edit'}/>
      <div className="my-requests-heading">
        <h1>My Requests</h1>
      </div>
      <div className="my-requests-body">
        <div className="my-requests-col-headers">
          <span className="request-col-header">Status</span>
          <span className="request-col-header">Approver</span>
          <span className="request-col-header">Type</span>
          <span className="request-col-header">Date Start</span>
          <span className="request-col-header">Date End</span>
          <span className="request-col-header">Total Days</span>
        </div>
        {rows.length > 0?
          <div className="my-requests-rows">
            {rows}
          </div>
        :
          <div className='no-results-found'>No Requests Found</div>
        }
      </div>
    </div>
  )
}

export default MyRequests