import React from 'react'
import Icon from './Icon'
import { useState } from 'react'
import { UserProfile } from './modal-group/Modal'

function UserCard({className='', username = 'User Name'}) {
  const [showUserProfile, setShowUserProfile] = useState();
  const toggleUserProfile = () => {
    setShowUserProfile(!showUserProfile);
  };

  return (
    <section 
      className={`flex items-center border hover:bg-green-50 p-2 w-[fit]  rounded-xl hover:cursor-pointer ${className}`}
      onClick={toggleUserProfile}
    >
      <span className='w-fit'>
        <Icon dataFeather='user'/>
      </span>

      <span className='text-xs font-semibold text-gray-800 px-2 w-full'>
        <p>{username}</p>
      </span>

      {showUserProfile && <UserProfile />}
    </section>
  )
}

export default UserCard