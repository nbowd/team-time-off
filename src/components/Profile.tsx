import '@/components/Profile.css'
import { auth, db } from "@/firebaseSetup";
import { collection, getDocs } from "firebase/firestore";
import defaultProfile from '@/assets/default_profile.jpg';
import plusIcon from '@/assets/icons/icons8-plus-64.png';
import calendarIcon from '@/assets/icons/icons8-calendar-50.png';
import clipboardIcon from '@/assets/icons/icons8-clipboard-32.png';
import listIcon from '@/assets/icons/icons8-list-50.png';
import usersIcon from '@/assets/icons/icons8-users-32.png';
import logoutIcon from '@/assets/icons/icons8-logout-64.png';
import { useEffect, useState } from 'react';
import firebase from "firebase/compat/app"; // used for interface types;
import { Link, useLocation  } from "react-router-dom";



interface ProfileProps {
  user: firebase.User | null
}

interface Employee {
  id: string,
  first_name: string,
  last_name: string,
  email: string,
  manager_privileges: boolean,
  profile_picture: string,
  remaining_pto: number,
  used_pto: number,
  national_holidays: string
}

function Profile({user}: ProfileProps) {
  const location = useLocation();  
  const [profile, setProfile] = useState<Employee>({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    manager_privileges: false,
    profile_picture: "",
    remaining_pto: 0,
    used_pto: 0,
    national_holidays: ""
  });

  const signOut = async () => {
    await auth.signOut();
  }

  const getProfile = async () => {
    const querySnapshot = await getDocs(collection(db, "Employees"));
    querySnapshot.forEach((doc) => {
      if (doc.data() && user!.uid === doc.data().id) {
        setProfile(doc.data() as Employee);
      }
    });
  }
  console.log(location)
  useEffect(() => {
    getProfile();
  }, [])

  return (
    <div className="profile">
      <div className="profile-info">
        <img className='profile-picture' src={defaultProfile} alt="default profile picture" />
        <h2>{profile.first_name} {profile.last_name}</h2>
        <h3>Remaining PTO Days: {profile.remaining_pto}</h3>
        <h3>Used PTO Days: {profile.used_pto}</h3>
      </div>
      <div className="navigation">
        <button className="new-request">
          <img src={plusIcon} alt="" className="profile-icon" />
          MAKE NEW REQUEST
        </button>
        <Link to='/' className={`calendar-nav ${location.pathname === '/'? 'current-nav': ''}`}>
          <img src={calendarIcon} alt="" className="profile-icon" />
          CALENDAR
        </Link>
        <Link to={`/requests/${profile.id}`} className={`my-requests-nav ${location.pathname.includes('/requests/')? 'current-nav': ''}`}>
          <img src={clipboardIcon} alt="" className="profile-icon" />
          MY REQUESTS
        </Link>
        {
          profile.manager_privileges ?
          <>
            <Link to='/requests' className={`handle-requests-nav ${location.pathname === '/requests'? 'current-nav': ''}`}>
              <img src={listIcon} alt="" className="profile-icon" />
              HANDLE REQUESTS
            </Link>
            <Link to='/users' className={`users-nav ${location.pathname === '/users'? 'current-nav': ''}`}>
              <img src={usersIcon} alt="" className="profile-icon" />
              USERS
            </Link>
          </> 
          :
          null}
      </div>
      <div className="logout">
        <button className="logout-btn" onClick={signOut}>
          <img src={logoutIcon} alt="" className="profile-icon" />
          LOG OUT
        </button>
      </div>
    </div>
  )
}

export default Profile