import React from 'react'
import Icon from './Icon'
import { useState } from 'react'
import { UserProfile } from './modal-group/Modal'
import userIcon from '../assets/default-icon.png';

function UserCard({className='', username = 'User Name'}) {
  const [showUserProfile, setShowUserProfile] = useState();
  const toggleUserProfile = () => {
    setShowUserProfile(!showUserProfile);
  };

  return (
    <section 
      className={`flex items-center border hover:bg-green-50 p-2 w-[fit]  rounded-lg hover:cursor-pointer ${className}`}
      onClick={toggleUserProfile}
    >
      <img className='w-6 h-6' src={userIcon} alt="user-icon" />

      <span className='text-xs font-semibold text-gray-800 px-3 w-full'>
        <p>{username}</p>
      </span>

      {showUserProfile && <UserProfile />}
    </section>
  )
}

export default UserCard