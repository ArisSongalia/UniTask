import React, { useState, useEffect } from 'react'
import Button from './Button'
import Icon from './Icon'
import { IconAction } from './Icon';
import { Link } from 'react-router-dom';
import { UserProfile } from './modal-group/Modal'
import userIcon from '../assets/default-icon.png';
import Popup from './modal-group/Popup';
import { useProjectContext } from '../context/ProjectContext';
import { auth } from '../config/firebase';


function AlertCard({
  text = 'Title', 
  count = 0, 
  className = '', 
  user = 'User', 
  taskName = 'Task'
}) {
  return (
  <section className={`flex flex-col bg-green-800 w-full cursor-pointer rounded-md
                       p-4 justify-between text-white h-auto shadow-sm ${className}`}>
      <span >
        <h2 className='font-semibold mb-2'>{text}</h2>
        <p className='text-sm'>Hi <u>{user}</u>, Tasks for today</p>
      </span>

      <div className="flex gap-6 w-full">
        <section id='tasks' className='flex items-start py-8'>
          <span className="flex flex-col items-center">
            <p className='font-bold text-4xl'>{count}</p>
            <p className='font-semibold text-sm'>{taskName}</p>
          </span>
        </section>

        <section id='projects' className='flex items-start py-8'>
          <span className="flex flex-col items-center">
            <p className='font-bold text-4xl'>{count}</p>
            <p className='font-semibold text-sm'>{taskName}</p>
          </span>
        </section>

        <section id='projects' className='flex items-start py-8'>
          <span className="flex flex-col items-center">
            <p className='font-bold text-4xl'>{count}</p>
            <p className='font-semibold text-sm'>{taskName}</p>
          </span>
        </section>
      </div>

      <Button text='Check Pending'/>
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

function CreateCard({ title = "Title", description = "Description", onClick, className = ''}) {
  return (
    <div
      className={`flex flex-col bg-green-50 rounded-xl overflow-hidden text-green-900 hover:cursor-pointer hover:border-opacity-50
      flex-grow justify-between border-2 gap-4 border-green-800 border-opacity-30 hover:bg-green-100 p-4 h-[15rem] ${className}`}
      onClick={onClick}
    >
      <span className="flex flex-col justify-between gap-4 w-full h-full items-center">
          <span className='self-start flex flex-col gap-2 justify-between'>
            <span className="flex items-center">
              <h2 className='font-bold text-sm text-green-700'>{title}</h2>
              <Icon dataFeather='plus' />
            </span>
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
  type = 'Solo / Shared',
  id = '',
  }) {

  const { setProjectID } = useProjectContext();

  const handleSetActiveProject = async () => {
    if (id) {
      setProjectID(id);
      localStorage.setItem('activeProjectId', id);
    } else {
      console.error("Error: Project does not exist");
    }
  };

  const [showPopUp, setShowPopUp] = useState(false);

  const togglePopUp = () => { 
    setShowPopUp(!showPopUp);
  };

  return (
    <div
      className="flex flex-col bg-white rounded-xl overflow-hidden
        flex-grow justify-between border gap-4 border-green-700 border-opacity-50 p-4 h-[15rem]"
    >
      <section className="flex gap-4 w-full">
        <span className='w-full'>
          <h4 className="font-bold  mb-2 overflow-hidden text-sm text-ellipsis">{title}</h4>
          <span className='flex items-center gap-2 w-[rem] whitespace-nowrap'>
            <p className="font-semibold text-gray-600 text-xs">{type}</p>
            <p>•</p>
            <p className="text-xs font-semibold text-gray-600 ">{date}</p>
          </span>
        </span>

        <IconAction dataFeather="more-horizontal" iconOnClick={togglePopUp} className="w-fit" />
        {showPopUp && <Popup closeModal={togglePopUp} title={title} id={id} db='projects'/>}
      </section>

      <section className="flex flex-col h-full w-full overflow-hidden overflow-y-scroll">
        <p className="text-sm text-gray-700 mb-2 break-words text-ellipsis pr-2">{description}</p>
      </section>

      <Link to={'./Project'} className="w-full">
        <Button text="Open Project" className="w-full" onClick={handleSetActiveProject} /> 
      </Link>
    </div>
  );
}


function UserCard({className='', username='User Name', role='Owner', onStateChange}) {
  const [isActive, setIsActive] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [uid, setUid] = useState(null);
  const activeUid = auth.currentUser?.uid;

  const toggleUserProfile = () => {
    setShowUserProfile(!showUserProfile);
  };

  useEffect(() => {
    const getcurUid = async () => {
      setUid(activeUid);
    }

    getcurUid();
  }, [activeUid])

  const toggleIsActive = () => {
    setIsActive(!isActive);
    if (uid) {
      console.log('UserCard id: ', uid)
    } else {
      console.log('No id')
    };
  };

  useEffect(() => {
    if (onStateChange && uid) {
      onStateChange({uid: uid, isActive})
    }
  }, [uid, isActive])

  return (
    <section 
      className={`flex items-center border w-fit rounded-lg hover:cursor-pointer aria-selected:bg-green-50 bg-white ${className}`}
    >
      <span className="p-2 hover:bg-green-50 border-r h-full " onClick={toggleUserProfile}>
        <img className='w-8 rounded-full' src={userIcon} alt="user-icon" />
        {showUserProfile && <UserProfile closeModal={toggleUserProfile}/>}
      </span>

      <span className={`flex flex-col font-semibold px-3 w-full h-full p-2 rounded-md hover:bg-green-700 hover:text-white ${isActive ? 'bg-green-700 text-white' : 'bg-solid'}`} onClick={toggleIsActive} >
        <p className='text-sm'>{username}</p>
        <p className='text-xs'>{role}</p>
      </span>
    </section>
  )
}


function ProgressCard({title = 'Task Title', description = 'Description', deadline = '', team, id}) {
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
          <h2 className="font-bold mb-2 text-sm">{title}</h2>
          <p className="text-xs font-semibold text-gray-500"><span>Deadline: </span>{deadline}</p>
        </span>
        <IconAction dataFeather='more-vertical' className='' iconOnClick={togglePopUp}/>
        {showPopUp && <Popup title={title} id={id} closeModal={togglePopUp} collectionName='tasks' />}
      </span>

      <p className='text-sm'>{description}</p>

      <span id="task-user" className='flex gap-1'>
        {team}
      </span>

      <span className="flex w-full gap-1">
        <Button 
          text='Upload File' 
          className='w-full bg-blue-50 text-blue-700' 
          onClick={triggerFileInput}
        />
        <input id='file-input' type="file" className='hidden' />
        <Button 
          text='Move Status' 
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