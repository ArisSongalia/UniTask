import React from 'react'
import Icon from './Icon'
import { useState } from 'react'
import { UserProfile } from './Modal'

function UserCard({className='', name = 'User Name'}) {
  const [showUserProfile, setShowUserProfile] = useState();
  const toggleUserProfile = () => {
    setShowUserProfile(!showUserProfile);
  };

  return (
    <section 
      className={`flex items-center gap-2 border hover:bg-green-50 p-2 w-[9rem] rounded-xl hover:cursor-pointer ${className}`}
      onClick={toggleUserProfile}
    >
      <span className='w-fit'>
        <Icon dataFeather='user'/>
      </span>
      <span className='w-full'>
        <span className='text-xs font-semibold text-gray-800'>
          {name}  
      </span>
      </span>
      {showUserProfile && <UserProfile />}
    </section>
  )
}

export default UserCard