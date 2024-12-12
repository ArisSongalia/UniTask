import React, { useState } from 'react'
import Button from './Button'
import Icon from './Icon'
import { IconAction } from './Icon';
import { Link } from 'react-router-dom';
import { UserProfile } from './modal-group/Modal'
import userIcon from '../assets/default-icon.png';


function AlertCard({text = 'Title', count = 0, className = '', user = 'User', taskName = 'Task'}) {
  return (
  <section className={`flex flex-col bg-green-800 w-full cursor-pointer rounded-md
                       p-4 justify-between text-white h-auto shadow-sm ${className}`}>
      <span >
        <h2 className='font-semibold mb-2'>{text}</h2>
        <p className='text-sm'>Hi <u>{user}</u>, Tasks for today</p>
      </span>
      <section className='flex items-start py-8'>
        <span className="flex flex-col items-center">
          <p className='font-bold text-4xl'>{count}</p>
          <p className='font-semibold text-sm'>{taskName}</p>
        </span>
      </section>
      <Button text='Check Pending' className='text-white border-white hover:bg-green-900'/>
    </section>
  )
}

function AlertBox({text = 'Title', className = '', email= 'User'}) {
  return (
  <section className={`flex flex-col bg-green-50 border text-green-900 border-green-300 w-full cursor-pointer rounded-2xl
                       p-4 justify-between h-auto shadow-sm ${className}`}>
      <span >
        <h2 className='font-semibold mb-2'>Welcome to UniTask! {email}</h2>
        <p>{text}</p>
      </span>
    </section>
  )
}

function CreateCard({ title = "Title", description = "Description", onClick}) {
  return (
    <div
      className="flex flex-col bg-white rounded-xl overflow-hidden hover:cursor-pointer hover:border-opacity-100
      flex-grow justify-between border-2 gap-4 border-green-700 border-opacity-50 p-4 h-[15rem]"
      onClick={onClick}
    >
      <span className="flex flex-col justify-between gap-4 w-full items-center">
        <Icon dataFeather='plus' className='self-end'/>
        <span className='self-start flex flex-col gap-2'> 
          <h2 className='font-semibold text-md'>{title}</h2>
          <p className='text-sm'>{description}</p>
        </span>
      </span>
    </div>
  );
}

function ProjectCard({ 
  title = 'Project Name', 
  description = 'Example text should go here',
  date = '00/00/00',
}) {
  const [showPopUp, setShowPopUp] = useState(false);

  const togglePopUp = (e) => {
    e.stopPropagation(); 
    setShowPopUp(!showPopUp);
  };

  return (
    <div
      className="flex flex-col bg-white rounded-xl overflow-hidden
        flex-grow justify-between border gap-4 border-green-700 border-opacity-50 p-4 h-[15rem]"
    >
      <span className="flex justify-between gap-4">
        <span>
          <h2 className="font-bold mb-2">{title}</h2>
          <p className="text-xs font-semibold text-gray-600">{date}</p>
        </span>
        <IconAction dataFeather="more-horizontal" iconOnClick={togglePopUp} className='' />
        {showPopUp && <Popup closeModal={togglePopUp} title={title} />}
      </span>
      
      <p className="text-sm flex-grow">
        {description}
      </p>
      <Link to='TaskMain' className='w-full'>
        <Button text='Open Project' className='w-full'/>
      </Link>
    </div>
  );
}

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


export default AlertCard

export { AlertBox, CreateCard, ProjectCard, UserCard  }