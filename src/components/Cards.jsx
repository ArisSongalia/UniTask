import React, { useState, useEffect } from 'react'
import Button from './Button'
import Icon from './Icon'
import { IconAction } from './Icon';
import { Link, useLocation } from 'react-router-dom';
import { UserProfile } from './modal-group/Modal'
import userIcon from '../assets/default-icon.png';
import Popup from './modal-group/Popup';
import { useProjectContext } from '../context/ProjectContext';
import { FetchUserName } from '../services/FetchData';
import { doc, query, updateDoc, where } from 'firebase/firestore';
import { useReloadContext } from '../context/ReloadContext';
import { db } from '../config/firebase';
import { useFetchTaskData, fetchNoteData } from '../services/FetchData';
import { IconUser } from './Icon';
import { IconTitleSection } from './TitleSection';


function SummaryCard({
  title = 'Summary Card', 
  count = 0, 
  className = '', 
  }) {

  const { key } = useReloadContext()
  const [taskData, setTaskData] = useState([]);
  const [noteData, setNoteData] = useState([])
  const [loading, setLoading] = useState(true);

  useFetchTaskData( setTaskData, setLoading, key)
  fetchNoteData( setNoteData, setLoading, key)
  

  return (
  <section className={`flex flex-col bg-green-800 w-full rounded-md gap-4
                       p-4 justify-between text-white h-auto shadow-sm ${className}`}>
      <span className='flex flex-col w-full justify-between'>
        <h2 className='font-bold mb-1'>{title}</h2>
        <p className='font-semibold text-sm'>Hi <span><FetchUserName /></span>, Here's your tasks📋</p>
      </span>

      <div className="flex gap-1 w-full h-fit">
        <CountCard count={taskData.length} title='Assigned Task' className='' />
        <CountCard count={noteData.length} title='Action Notes' className=''/>
        <CountCard count={count} title='Actions' />

      </div>

      <Button text='Check Pending'/>
    </section>
  )
}

function CountCard({ count = '', title = '', onClick, className = ''}) {
  return (  
    <section 
      id='tasks' 
      className={`flex flex-col items-center h-full w-full p-4 bg-green-700 text-white rounded-lg  ${className}`}
    >
        <p className='font-bold text-xl'>{count}</p>
        <p className='font-semibold text-sm text-center'>{title}</p>
    </section>
  )
}

function AlertCard({text = 'text', title = 'Welcome to UniTask, ', className = ''}) {
  return (
  <section className={`flex flex-col bg-green-50 border text-green-900 border-green-300 w-full cursor-pointer rounded-2xl
                       p-4 justify-between h-auto shadow-sm ${className}`}>
      <span >
        <h2 className='font-semibold'>{title} </h2>
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


function UserCard({className='', username='User Name', uid, email, onStateChange}) {
  const [isActive, setIsActive] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false);

  const toggleUserProfile = () => {
    setShowUserProfile(!showUserProfile);
  };

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
      onStateChange({uid, username, isActive})
    }
  }, [uid, username, isActive])

  return (
    <section 
      className={`flex items-center border w-fit rounded-lg hover:cursor-pointer aria-selected:bg-green-50 bg-white ${className}`}
    >
      <span className="p-2 hover:bg-green-50 border-r h-full " onClick={toggleUserProfile}>
        <img className='w-8 h-auto rounded-full' src={userIcon} alt="user-icon" />
        {showUserProfile && <UserProfile username={username} email={email} closeModal={toggleUserProfile}/>}
      </span>

      <span className={`flex flex-col font-semibold px-3 w-full h-full p-2 rounded-md hover:bg-green-700 hover:text-white ${isActive ? 'bg-green-700 text-white' : 'bg-solid'}`} onClick={toggleIsActive} >
        <p className='text-sm'>{username}</p>
      </span>
    </section>
  )
}


function TaskCard({title = 'Task Title', description = 'Description', deadline = '', team, status, id, className, }) {
  const [showPopUp, setShowPopUp] = useState(false);
  const { reloadComponent } = useReloadContext();
  const location = useLocation();

  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById('file-input');
    fileInput.click();
  };

  const moveStatus = async () => {
    const taskRef = doc(db, 'tasks', id);

    try {
      await updateDoc(taskRef, { ['task-status']: "In-progress"});
      reloadComponent();
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div 
      className={`flex flex-col bg-white rounded-xl h-auto border-opacity-50
        w-full justify-between border gap-2 border-green-600 p-4 ${className}`}
    >
      <span className='flex justify-between'>
        <span>
          <h2 className="font-bold mb-1 text-sm">{title}</h2>
          <span className='flex gap-1 text-xs font-semibold text-gray-600 items-center'>
            <span>{status}</span>
            <p>•</p>
            <p>{deadline}</p>
          </span>
        </span>
        <IconAction dataFeather='more-vertical' className='' iconOnClick={togglePopUp}/>
        {showPopUp && <Popup title={title} id={id} closeModal={togglePopUp} collectionName='tasks' />}
      </span>

      <p className='text-sm py-2'>{description}</p>

      <span id="task-user" className='flex w-full gap-1'>
        {!team || team.length > 0 ?(
          team.map((member) => (
            <IconUser key={member.uid} username={member.username} uid={member.uid} />
          ))
        ) : (
          null
        )}
      </span>

      {(location.pathname === '/Project') ? (
        <span className="flex w-full gap-1">
          <Button 
            text='Upload File' 
            className='w-full bg-white' 
            onClick={triggerFileInput}
          />
          <input id='file-input' type="file" className='hidden' />
          <Button 
            text='Move Status' 
            className='w-full'
            onClick={moveStatus}
          />
        </span>
      ) : (
        <Link to={'./Project'}>
          <Button text='Open Task' className='w-full'/>
        </Link>
      )
        
      }
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

function CanvasCard({title = 'Canvas Title', description = 'Canvas description', date = '00/00/00', id, className}) {
  const [showPopUp, setShowPopUp] = useState(false);

  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  }

  return(
    <div 
    className={`flex flex-col bg-white p-4 gap-2 h-[12rem] justify-between w-full rounded-xl border-opacity-50 
    shadow-sm border border-green-600 ${className}`}>
      <span className='flex justify-between'>
        <span>
          <h2 className="font-bold mb-1 text-sm">{title}</h2>
          <p className='text-xs text-gray-600 font-semibold'>{date}</p>
        </span>
        <IconAction dataFeather='more-vertical' className='' iconOnClick={togglePopUp}/>
        {showPopUp && <Popup title={title} id={id} closeModal={togglePopUp} collectionName='tasks' />}
      </span>
      <span className='w-full h-full bg-gray-50 rounded-lg'></span>

      <Button text='Open Canvas' />
    </div>
  )
}


export { AlertCard, CreateCard, ProjectCard, UserCard, TaskCard, ProgressAlertCard, SummaryCard, CountCard, CanvasCard }