import firebase from "firebase/compat/app"; // for User props typing
import { differenceInBusinessDays, add } from 'date-fns';
import { Employee } from "@/types";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseSetup";

export const settings = {
  totalPTO: 25,
  nameColors: [
    '#9F0000',
    '#830091',
    '#166700',
    '#00219A',
    '#005B98',
    '#AE0046',
    '#00644E',
  ]
}

export const getBusinessDays = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = add(new Date(end), {days: 1})

  const totalDays = differenceInBusinessDays(endDate, startDate);
  return totalDays
}

export const getProfile = async (user: firebase.User) => {
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
  return currentUser
}

const errorShake = (errorRef: React.RefObject<HTMLInputElement>) => {
  const interval = setInterval(move, 50)
  let px = 8;
  function move() {
    errorRef.current!.style.marginLeft = px + 'px';
    px = px < 0 ? ((px * -1) - 1) : ((px * -1) + 1);
    if (px === 1) clearInterval(interval);
  }
}

export const handleError = (error:string, setErrorMsg: Function, errorRef: React.RefObject<HTMLInputElement>) => {
  let newError = error;
  if (error.slice(0,10) === 'Firebase: ') {
    newError = error.slice(10)
  }
  setErrorMsg(newError)
  errorShake(errorRef);
}