import React, { useState } from 'react'
import Button from './Button'
import Icon from './Icon'
import { IconAction } from './Icon';
import { Link } from 'react-router-dom';
import { UserProfile } from './modal-group/Modal'
import userIcon from '../assets/default-icon.png';
import Popup from './modal-group/Popup';



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
      flex-grow justify-between border-2 gap-4 border-green-700 border-opacity-50 p-4 h-[15rem] hover:text-green-950"
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
  type = 'Solo / Shared'
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
      <section className="flex gap-4 w-full">
        <span className='w-full max-w-[80%]'>
          <h2 className="font-bold mb-2 overflow-hidden text-ellipsis">{title}</h2>
          <span className='flex items-center gap-2'>
            <p className="font-semibold text-gray-600 text-xs">{type}</p>
            <p>•</p>
            <p className="text-xs font-semibold text-gray-600">{date}</p>
          </span>
        </span>

        <IconAction dataFeather="more-horizontal" iconOnClick={togglePopUp} className="w-fit" />
        {showPopUp && <Popup closeModal={togglePopUp} title={title} />}
      </section>

      <section className="flex flex-col h-full w-full overflow-hidden overflow-y-scroll">
        <p className="text-sm text-gray-700 mb-2 break-words text-ellipsis pr-2">{description}</p>
      </section>

      <Link to="TaskMain" className="w-full">
        <Button text="Open Project" className="w-full" />
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


function ProgressCard({title = 'Task Title'}) {
  const [isClicked, setIsClicked] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);

  const toggleClick = () => {
    setIsClicked(!isClicked);
  };

  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById('file-input');
    fileInput.click();
  };

  return (
    <div className="flex flex-col bg-white rounded-xl h-auto border-opacity-50
                      w-full justify-between border gap-2 border-green-700 p-4">
      <span className='flex justify-between'>
        <span>
          <h2 className="font-bold mb-2">{title}</h2>
          <p className="text-xs font-semibold text-gray-500">30/10/2024</p>
        </span>
        <IconAction dataFeather='more-vertical' className='' iconOnClick={togglePopUp}/>
        {showPopUp && <Popup title={title} closeModal={togglePopUp}/>}
      </span>

      <p className="text-sm">Lorem ipsum dolor sit amet. Example text should go here</p>

      <span id="task-user" className='flex gap-1'>
        <IconAction dataFeather='user'/>
        <IconAction dataFeather='user'/>
        <IconAction dataFeather='user'/>
      </span>

      <span className="flex w-full gap-1">
        <Button 
          text='Upload File' 
          className='w-full' 
          onClick={triggerFileInput}
        />
        <input id='file-input' type="file" className='hidden' />
        <Button 
          text='Mark Finish' 
          className={`${isClicked ? 'bg-green-700 text-white w-full' : 'w-full'}`}
          onClick={toggleClick}
        />
      </span>
    </div>
  )
}

function ProgressAlertCard({title = 'Task Title', description = 'Lorem ipsum dolor sit amet. Example text should go here Lorem ipsum dolor sit amet.'}) {
  const [showPopUp, setShowPopUp] = useState(false);
  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  };

  return (
    <div className="flex flex-col bg-white rounded-xl h-auto border-opacity-50
                      w-full justify-between border gap-2 border-green-700 p-4">
      <span className='flex justify-between'>
        <span>
          <h2 className="font-bold mb-2">{title}</h2>
          <p className="text-xs font-semibold text-gray-500">30/10/2024</p>
        </span>
        <IconAction dataFeather='more-vertical' className='' iconOnClick={togglePopUp}/>
        {showPopUp && <Popup title={title} closeModal={togglePopUp}/>}
      </span>

      <p className="text-sm my-2">
        {description}
      </p>

      <span className="flex w-full gap-1">
        <Link to={"../TaskMain"} className='w-full'>
          <Button 
            text='Open Task' 
            className='w-full' 
          />
        </Link>
      </span>
    </div>
  )
}


export { AlertBox, CreateCard, ProjectCard, UserCard, ProgressCard, ProgressAlertCard, AlertCard }