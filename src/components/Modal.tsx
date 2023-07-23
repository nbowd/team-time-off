import Dropdown, { Option } from "react-dropdown";
import 'react-dropdown/style.css';
import TextInput from './TextInput';
import React, { useState, useContext, useEffect } from 'react'
import '@/components/Modal.css'
import { Employee, Request } from "@/types";
import { db } from "@/firebaseSetup";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { AuthContext } from "@/context/AuthContext";



interface ModalProps {
  modalRef: React.RefObject<HTMLDialogElement>,
  type: string,
  profile?: Employee | null,
  request?: Request
}

function Modal({modalRef, profile, request, type}: ModalProps) {
  const [approver, setApprover] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [managers, setManagers] = useState<string[]>([])
    
    const user = useContext(AuthContext);
   
    const onDialogClick = (e: React.MouseEvent<HTMLDialogElement, MouseEvent>) => {
      const dialogDimensions = modalRef.current?.getBoundingClientRect();

      if (e.clientX < dialogDimensions!.left ||
          e.clientX > dialogDimensions!.right ||
          e.clientY < dialogDimensions!.top ||
          e.clientY > dialogDimensions!.bottom ) {
        modalRef.current?.close()
      }
    }

    const handleSubmit = () => {
      if (type === 'create') {
        handleCreate();
      }

      if (type === 'edit') {
        handleEdit();
      }
    }

    const handleCreate = async () => {
      if (user?.uid !== profile?.employee_id) return
      try {
        const newDocRef = doc(collection(db, "Requests"));
        await setDoc(
          newDocRef,
          {
            id: newDocRef.id,
            employee_id: profile?.employee_id,
            status: 'pending',
            type: leaveType,
            start_date: dateStart,
            end_date: dateEnd,
            approver: approver
          }
        )
        modalRef.current?.close()
      } catch (error) {
        console.log(error)
      }
    }

    const handleEdit = async () => {
      try {
        await setDoc(doc(db, "Requests", request!.id), {
          id: request!.id,
          employee_id: request!.employee_id,
          status: request!.status,
          type: leaveType,
          start_date: dateStart,
          end_date: dateEnd,
          approver: approver
        })
        modalRef.current?.close()
      } catch (error) {
        console.log(error)
      }
    }

    const changeApprover = (option: Option) => {
      setApprover(option.value)
    }

    const changeLeaveType = (option: Option) => {
      setLeaveType(option.value)
    }

    const fetchManagers = async () => {
      const requestsRef = collection(db, "Employees");
      const q = query(requestsRef, where("manager_privileges", "==", true))
      const querySnapshot = await getDocs(q); 
      let tempArray:string[] = []
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
          const user = doc.data() as Employee;
          tempArray.push(`${user.first_name} ${user.last_name}`)
      });
      setManagers(tempArray)
  
    }

    useEffect(() => {
      fetchManagers();
      if (request && request?.id.length > 0) {
        setApprover(request.approver)
        setLeaveType(request.type)
        setDateStart(request.start_date)
        setDateEnd(request.end_date)
      }
    },[request])

    return (
      <dialog ref={modalRef} onClick={(e) => onDialogClick(e)} className="modal">
      <div className="dialog-div">
        <div className='modal-form'>
          <h2>New Request:</h2>
          <Dropdown options={['Flex Leave', 'Sick Leave', 'Parental Leave']} value={leaveType} placeholder={leaveType.length === 0? 'Type:': leaveType} onChange={changeLeaveType}/>
          <Dropdown options={managers} value={approver} placeholder={approver.length === 0? 'Approver:': approver} onChange={changeApprover} />
          <TextInput type='date' label='Date Start:' value={dateStart} handleChange={(new_value:string) => setDateStart(new_value)}/>
          <TextInput type='date' label='Date End:' value={dateEnd} handleChange={(new_value:string) => setDateEnd(new_value)} />
        </div>
        <button className='modal-submit' onClick={handleSubmit}>Submit</button>
        <button onClick={() => modalRef.current?.close()} formMethod='dialog' className='close-modal'>&times;</button>
      </div>
    </dialog>
    
    )
  }

export default Modal