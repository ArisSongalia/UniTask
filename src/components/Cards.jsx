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
import { doc, getDoc, query, updateDoc, where } from 'firebase/firestore';
import { useReloadContext } from '../context/ReloadContext';
import { db } from '../config/firebase';
import { useFetchTaskData, fetchNoteData } from '../services/FetchData';
import { IconUser } from './Icon';
import MainCanvas from './modal-group/MainCanvas';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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
  <section className={`flex flex-col bg-green-800 w-full rounded-lg gap-4
                       p-4 justify-between text-white h-auto shadow-sm ${className}`}>
      <span className='flex flex-col w-full justify-between border-b-2 pb-2'>
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
      className={`flex flex-col items-center h-auto w-full p-2 text-white rounded-lg  ${className}`}
    >
        <p className='font-bold text-3xl'>{count}</p>
        <p className='text-sm text-center'>{title}</p>
    </section>
  )
}

function AlertCard({text = 'text', className = ''}) {
  return (
  <section className={`flex flex-col bg-green-50 border text-green-900 border-green-300 w-full cursor-pointer rounded-lg
                       p-4 justify-between h-auto shadow-sm ${className}`}>
        <p>{text}</p>
    </section>
  )
}

function CreateCard({ title = "Title", description = "Description", onClick, className = ''}) {
  return (
    <div
      className={`flex flex-col bg-green-50 rounded-lg overflow-hidden text-green-900 hover:cursor-pointer hover:border-opacity-50
      flex-grow justify-between border-2 gap-4 border-green-800 border-opacity-30 hover:bg-green-100 p-4 h-[15rem] ${className}`}
      onClick={onClick}
    >
      <span className="flex flex-col justify-between gap-4 w-full h-full items-center">
          <span className='self-start flex flex-col gap-2 justify-between'>
            <span className="flex justify-between items-center mb-2">
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
      className="flex flex-col bg-white rounded-lg overflow-hidden
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
        {showPopUp && <Popup closeModal={togglePopUp} title={title} id={id} collectionName='projects'/>}
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


function UserCard({className='', user, onStateChange}) {
  const [isActive, setIsActive] = useState(false)

  const toggleIsActive = () => {
    setIsActive(!isActive);
    if (user) {
      console.log('UserCard Active:', user.uid)
    } else {
      console.log('No id')
    };
  };

  useEffect(() => {
    if (onStateChange && user) {
      const { username, email, uid } = user;
      onStateChange({ username, email, uid, isActive });
    }
  }, [user, isActive]);

  return (
    <section 
      className={`flex items-center border w-full rounded-lg hover:cursor-pointer aria-selected:bg-green-50 bg-white ${className}`}
    >
      <span className={`flex flex-col font-semibold px-3 gap-1 w-full h-full p-4 rounded-md hover:bg-green-50 items-center ${isActive ? 'bg-green-100' : 'bg-solid'}`} onClick={toggleIsActive} >
        <img className='w-7 h-7 rounded-full' src={userIcon} alt="user-icon" />
        <p className='text-sm'>{user.username}</p>
        <p className='text-sm text-gray-500'>{user.email}</p>
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
      const statusSnap = await getDoc(taskRef);

      if (statusSnap.exists()) {
        const currentStatus = statusSnap.data()["task-status"];
        if(currentStatus === "To-do") {
          await updateDoc(taskRef, { ['task-status']: "In-progress"});
        } else if (currentStatus === "In-progress") {
          await updateDoc(taskRef, { ['task-status']: "Finished"});
        }

        reloadComponent();
      } else {
        console.error('Task not found');
        toast.error('Task not found')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div 
      className={`flex flex-col bg-white rounded-lg h-auto border-opacity-50
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
      
      <span id="task-user" className='flex p-2 gap-1 bg-blue-50 rounded-full w-fit'>
        {!team || team.length > 0 ?(
          team.map((member) => (
            <IconUser key={member.uid} user={member}/>
          ))
        ) : (
          null
        )}
      </span>

      { status === "Finished" ? (
        null
      ) : location.pathname === '/Project' ? (
        <span className="flex w-full gap-1">
          <Button 
            text='Upload File' 
            className='w-full bg-blue-50 hover:bg-blue-700' 
            onClick={triggerFileInput}
            dataFeather='file-plus'
          />
          <input id='file-input' type="file" className='hidden' />
          <Button 
            text='Move Status' 
            className='w-full'
            onClick={moveStatus}
          />
          <ToastContainer />
        </span>
      ) : (
        <Link to={'./Project'}>
          <Button text='Open Task' className='w-full'/>
        </Link>
      )}
    </div>
  )
}


function ProgressAlertCard({title = 'Task Title', description = 'Lorem ipsum dolor sit amet. Example text should go here Lorem ipsum dolor sit amet.'}) {
  const [showPopUp, setShowPopUp] = useState(false);
  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  };

  return (
    <div className="flex flex-col bg-white rounded-lg h-auto border-opacity-50
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

function CanvasCard({title = 'Canvas Title', date = '00/00/00', id, className}) {
  const [showPopUp, setShowPopUp] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  }

  const toggleShowCanvas = () => {
    setShowCanvas(!showCanvas);
  }

  return(
    <div 
      className={`flex flex-col bg-white p-4 gap-2 h-[15rem] justify-between w-full rounded-lg border-opacity-50 
      shadow-sm border border-green-600 ${className}`}
    >
      <span className='flex justify-between'>
        <span>
          <h2 className="font-bold mb-1 text-sm">{title}</h2>
          <p className='text-xs text-gray-500 font-semibold'>{date}</p>
        </span>
        <IconAction dataFeather='more-vertical' className='' iconOnClick={togglePopUp}/>
        {showPopUp && <Popup title={title} id={id} closeModal={togglePopUp} collectionName='tasks' />}
      </span>
      <span className='w-full h-full bg-gray-50 rounded-lg'></span>

      <Button text='Open Canvas' onClick={toggleShowCanvas} dataFeather='maximize'/>
      {showCanvas && <MainCanvas closeModal={toggleShowCanvas}/>}
    </div>
  )
}


export { AlertCard, CreateCard, ProjectCard, UserCard, TaskCard, ProgressAlertCard, SummaryCard, CountCard, CanvasCard }