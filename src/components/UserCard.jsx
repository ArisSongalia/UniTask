import React from 'react'
import Icon from './Icon'

function UserCard({className='', name = 'User Name', onClick}) {
  return (
    <section 
      className={`flex items-center gap-2 hover:bg-green-50 p-2 w-[9rem] rounded-xl hover:cursor-pointer ${className}`}
      onClick={onClick}
    >
      <span className='w-fit'>
        <Icon dataFeather='user'/>
      </span>
      <span className='w-full'>
        <span className='text-xs font-semibold text-gray-800'>
          {name}  
      </span>
      </span>
    </section>
  )
}

export default UserCard