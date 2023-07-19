import '@/scenes/Users.css'
import { db } from "@/firebaseSetup";
import { collection, getDocs } from "firebase/firestore";
import {useState, useEffect} from 'react'
import { Employee } from '@/types';
import defaultProfile from '@/assets/default_profile.jpg';
import triangle from '@/assets/icons/icons8-triangle-30.png'


function Users() {
  const [employees, setEmployees] = useState<Employee[] | []>([]);
  const [nameRows, setNameRows] = useState<React.ReactNode[] | []>([]);

  const [activeEmployee, setActiveEmployee] = useState<Employee>({
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    manager_privileges: false,
    profile_picture: '',
    remaining_pto: -1,
    used_pto: -1,
    national_holidays: ''
  });

  const buildNameRows = (users: Employee[]) => {
    console.log('current users', employees)
    console.log('current active', activeEmployee)
    const tempRows = users.map((user: Employee) => {
      return <div key={user.id} className={activeEmployee.id === user.id? 'user-row user-active': 'user-row'} onClick={() => setActiveEmployee(user)}>
        <div className='user-profile-info'>
          <img src={defaultProfile} alt="profile picture" className='user-row-profile-picture' />
          <div className="user-name-email">
            <span className='user-name'>{`${user.first_name} ${user.last_name}`}</span>
            <span className='user-email'>{user.email}</span>
          </div>
        </div>
        <img src={triangle} alt="Triangle for visual highlighting" className='user-row-triangle' />
      </div>
    })
    setNameRows(tempRows)
  }

  const getProfile = async () => {
    const querySnapshot = await getDocs(collection(db, "Employees"));
    let tempArray:Employee[] = []
    querySnapshot.forEach((doc) => {
        tempArray.push(doc.data() as Employee)
    });
    setEmployees(tempArray); 
    setActiveEmployee({...tempArray[0]})
    buildNameRows(tempArray);
  }
  console.log(employees)

  useEffect(() => {
    getProfile();
  }, [])
  return (
    <div className="users">
      <div className="users-heading">
        <h1>Users</h1>
      </div>
      <div className="users-body">
        <div className="users-body-left">
          <h3>Name</h3>
          {nameRows}
        </div>
        <div className="users-body-right">right</div>
      </div>
    </div>
  )
}

export default Users