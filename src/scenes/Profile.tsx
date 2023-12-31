import '@/scenes/Profile.css'
import { auth, db } from "@/firebaseSetup";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import defaultProfile from '@/assets/default_profile.jpg';
import plusIcon from '@/assets/icons/icons8-plus-64.png';
import calendarIcon from '@/assets/icons/icons8-calendar-50.png';
import clipboardIcon from '@/assets/icons/icons8-clipboard-32.png';
import listIcon from '@/assets/icons/icons8-list-50.png';
import usersIcon from '@/assets/icons/icons8-users-32.png';
import logoutIcon from '@/assets/icons/icons8-logout-64.png';
import cameraIcon from '@/assets/icons/icons8-add-camera-48.png';
import { useEffect, useRef, useState } from 'react';
import firebase from "firebase/compat/app"; // used for interface types;
import { Link, useLocation,useNavigate   } from "react-router-dom";
import Modal from '@/components/Modal';
import PictureModal from '@/components/PictureModal';
import { Employee } from '@/types';
import { settings } from '@/utils/helpers';

import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface ProfileProps {
  user: firebase.User | null
}

// used to override default MUI dropdown styling
const StyledFormControl = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(1),
  minWidth: 120,
  '& .MuiInputLabel-root': {
    color: 'white',
  },
  '& .MuiSvgIcon-root': {
    color: 'white',
  },
  '& .MuiSelect-select': {
    color: 'white',
  },
  '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
    borderColor: 'white',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'white',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'white',
  },
}));

function Profile({user}: ProfileProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<Employee | null>(null);
  const [profilePicture, setProfilePicture] = useState(defaultProfile) 
  const [profileColor, setProfileColor] = useState('');
  const modalRef = useRef<HTMLDialogElement>(null);
  const pictureModalRef = useRef<HTMLDialogElement>(null);

  const signOut = async () => {
    await auth.signOut();
    navigate("/")
  }

  const getProfile = async () => {
    const querySnapshot = await getDocs(collection(db, "Employees"));
    querySnapshot.forEach((doc) => {
      if (doc.data() && user!.uid === doc.data().employee_id) {
        const employee = doc.data() as Employee;
        setProfile(employee);
        setProfileColor(employee.color)
        
        if (employee.profile_picture) {
          setProfilePicture(doc.data().profile_picture)
        }
      }
    });
  }

  const handleColorChange = async (event: SelectChangeEvent) => {
    setProfileColor(event.target.value as string);

    profile && await setDoc(doc(db, "Employees", profile.id), {
      ...profile,
      color: event.target.value
    })
  };

  useEffect(() => {
    getProfile();
  }, [])

  return (
    <div className="profile">
      <div className="profile-info">
        <div className="profile-picture-wrapper" onClick={() => pictureModalRef.current?.showModal()}>
          <span className="picture-icon-wrapper">
            <img className='profile-picture-icon' src={cameraIcon} alt="" />
          </span>
          <img className='profile-picture' src={profilePicture} alt="default profile picture" />
        </div>
        <h2>{profile?.first_name} {profile?.last_name}</h2>
        <h3>Remaining PTO Days: {profile?.remaining_pto}</h3>
        <h3>Used PTO Days: {profile?.used_pto}</h3>
      </div>
      <div className="profile-color">

        <span id='color-preview' style={{backgroundColor: profileColor}}></span>
        <StyledFormControl variant="standard">
        <InputLabel id="demo-simple-select-label">Color</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={profileColor}
            label="Age"
            onChange={handleColorChange}
          >
            {settings.nameColors.map((color)=> {
              return <MenuItem value={color} key={'color'+color}><span className='color-square' style={{backgroundColor: color}} ></span> <b>{color}</b></MenuItem>
            })}

          </Select>
          </StyledFormControl>
      </div>
      <div className="navigation">
        <button className="new-request" onClick={() => modalRef.current?.showModal()}>
          <img src={plusIcon} alt="" className="profile-icon" />
          MAKE NEW REQUEST
        </button>
        <PictureModal pictureModalRef={pictureModalRef} user={user} profile={profile} setProfilePicture={setProfilePicture} />
        <Modal modalRef={modalRef} profile={profile} type={'create'} />
        <Link to='/' className={`calendar-nav ${location.pathname === '/'? 'current-nav': ''}`}>
          <img src={calendarIcon} alt="" className="profile-icon" />
          CALENDAR
        </Link>
        <Link to={`/requests/${profile?.id}`} className={`my-requests-nav ${location.pathname.includes('/requests/')? 'current-nav': ''}`}>
          <img src={clipboardIcon} alt="" className="profile-icon" />
          MY REQUESTS
        </Link>
        {
          profile?.manager_privileges ?
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