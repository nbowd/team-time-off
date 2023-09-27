import firebase from "firebase/compat/app"; // for User props typing
import { differenceInBusinessDays, add } from 'date-fns';
import { Employee } from "@/types";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseSetup";

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