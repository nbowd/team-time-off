import '@/components/UserRow.css'
import { Employee } from '@/types'
import defaultProfile from '@/assets/default_profile.jpg';
import triangle from '@/assets/icons/icons8-triangle-30.png';
import React, { useState } from 'react'

interface UserRowProps {
  user: Employee,
  active: boolean,
  setUser: Function
}

function UserRow({user, active, setUser}: UserRowProps) {
  return (
    <div key={user.id} className={active? 'user-row user-active': 'user-row'} onClick={() => setUser(user)}>
      <div className='user-profile-info'>
        <img src={user.profile_picture? user.profile_picture: defaultProfile} alt="profile picture" className='user-row-profile-picture' />
        <div className="user-name-email">
          <span className='user-name'>{`${user.first_name} ${user.last_name}`}</span>
          <span className='user-email'>{user.email}</span>
        </div>
      </div>
      <img src={triangle} alt="Triangle for visual highlighting" className={active? 'user-row-triangle': 'user-row-triangle hidden'} />
    </div>
  )
}

export default UserRow