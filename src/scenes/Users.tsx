import '@/scenes/Users.css'
import { db } from "@/firebaseSetup";
import { collection, getDocs } from "firebase/firestore";
import {useState, useEffect} from 'react'
import { Employee } from '@/types';
import UserRow from '@/components/UserRow';
import defaultProfile from '@/assets/default_profile.jpg';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';




function Users() {
  const [loaded, setLoaded] = useState(false);
  const [users, setUsers] = useState<Employee[] | []>([]);
  const [activeUser, setActiveUser] = useState<Employee | null>(null);

  const getProfile = async () => {
    const querySnapshot = await getDocs(collection(db, "Employees"));
    let tempArray:Employee[] = []
    querySnapshot.forEach((doc) => {
        tempArray.push(doc.data() as Employee)
    });
    setUsers(tempArray); 
    setActiveUser({...tempArray[0]})
    setLoaded(true);
  }

  const formatChartData = (remainingPTO: number, usedPTO: number) => {
    const data = {
      labels: ['Remaining PTO', 'Used PTO'],
      datasets: [
        {
          label: '# of Votes',
          data: [remainingPTO, usedPTO],
          backgroundColor: [
            '#00a35f',
            '#E52020',
          ],
          borderColor: [
            '#00a35f',
            '#E52020',
          ],
          borderWidth: 1,
        },
      ],
    };
    return data
  }

  useEffect(() => {
    getProfile();
  }, [])
  return (
    
    <div className="users">
      <div className="users-heading">
        <h1>Users</h1>
      </div>
      {loaded?
        <div className="users-body">
          <div className="users-body-left">
            <h3>Name</h3>
            {users.map((user: Employee)=>(
              <>
                <UserRow user={user} active={user.id === activeUser?.id} setUser={setActiveUser}/>
              </>
            ))}
          </div>
          <div className="users-body-right">
            <div className='users-body-right-profile'>
              <img src={defaultProfile} alt="Profile Picture" />
              <span>{activeUser?.first_name} {activeUser?.last_name}</span>
              <span>{activeUser?.email}</span>
            </div>
            <div className="user-graphs">
              <Doughnut data={formatChartData(activeUser!.remaining_pto, activeUser!.used_pto)} />
            </div>
            <div className="user-details">
              <h3>Time Off Details for {activeUser?.first_name} {activeUser?.last_name}</h3>
              <div className="user-detail-row">
                <div className="user-detail">
                  <span className="detail-bubble">25</span>
                  <span className="detail-label">Total PTO</span>
                </div>
                <div className="user-detail">
                  <span className="detail-bubble">{activeUser?.used_pto}</span>
                  <span className="detail-label">Used PTO</span>
                </div>
              </div>
              <div className="user-detail-row">
                <div className="user-detail">
                  <span className="detail-bubble">{activeUser?.remaining_pto}</span>
                  <span className="detail-label">Remaining PTO</span>
                </div>
                <div className="user-detail">
                  <span className="detail-bubble">{activeUser?.national_holidays}</span>
                  <span className="detail-label">National Holidays</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        :
        <h1></h1>
      }
    </div>
  )
}

export default Users