import Dropdown from "react-dropdown";
import 'react-dropdown/style.css';
import TextInput from './TextInput';
import React, { useState, useContext } from 'react'
import '@/components/Modal.css'
import { Employee } from "@/types";
import { db } from "@/firebaseSetup";
import { collection, doc, setDoc } from "firebase/firestore";
import { AuthContext } from "@/context/AuthContext";



interface ModalProps {
  modalRef: React.RefObject<HTMLDialogElement>,
  profile: Employee | null
}

  function Modal({modalRef, profile}: ModalProps) {
    const [approver, setApprover] = useState('');
    const [leaveType, setLeaveType] = useState('');
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');

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

    const handleSubmit = async () => {
      if (user?.uid !== profile?.id) return
      try {
        const newDocRef = doc(collection(db, "Requests"));
        await setDoc(
          newDocRef,
          {
            id: newDocRef.id,
            employee_id: profile?.id,
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

    const changeApprover = (option:any) => {
      setApprover(option.value)
    }

    const changeLeaveType = (option:any) => {
      setLeaveType(option.value)
    }
    return (
      <dialog ref={modalRef} onClick={(e) => onDialogClick(e)} >
      <div className="dialog-div">
        <div className='modal-form'>
          <h2>New Request:</h2>
          <Dropdown options={['Flex Leave', 'Sick Leave', 'Parental Leave']} placeholder='Type:' onChange={changeLeaveType}/>
          <Dropdown options={['First Manager', 'Second Manager']} placeholder='Approver:' onChange={changeApprover} />
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