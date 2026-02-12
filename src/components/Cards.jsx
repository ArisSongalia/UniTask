import React, { useEffect, useReducer, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import "react-toastify/dist/ReactToastify.css";
import Button from './Button';
import Icon, { IconAction, IconText, IconUser } from './Icon';
import MainCanvas from './modal-group/MainCanvas';
import { NoteFocus, TaskFocus } from "./modal-group/Modal";
import Popup from './modal-group/Popup';
import { IconTitleSection } from './TitleSection';


function SummaryCard({ 
  title = 'Summary', 
  description = '', 
  items = [], 
  loading = false, 
  className = '',
  SummaryContent = null 
}) {
  const [showSummary, setShowSummary] = useState(false);

  return (
    <section className={`flex flex-col bg-green-800 w-full rounded-md gap-4 shadow-md p-4 justify-between text-white h-auto ${className}`}>
      <span className='flex flex-col w-full border-b-2 border-white/20 pb-2'>
        <h2 className='font-bold mb-1'>{title}</h2>
        <p className='font-semibold text-sm opacity-90'>{description}</p>
      </span>

      {loading ? (
        <div className="flex justify-center py-6">
          <BarLoader color='white' />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
          {items.slice(0, 4).map((item, index) => (
            <div key={index} className="flex flex-col items-center justify-center bg-white/10 border border-white/10 rounded-md p-2 ">
              <span className="text-xl font-bold">{item.count}</span>
              <span className="text-[10px] uppercase font-medium tracking-tight text-center">{item.label}</span>
            </div>
          ))}
        </div>
      )}

      <Button 
        text='View Details' 
        onClick={() => setShowSummary(true)} 
        className="mt-2 bg-white !text-green-900 hover:bg-slate-100" 
      />

      {showSummary && SummaryContent && (
        <div className="text-slate-900">
           {React.cloneElement(SummaryContent, { closeModal: () => setShowSummary(false) })}
        </div>
      )}
    </section>
  );
}

function CountCard({ count = '', title = '', onClick, className = ''}) {
  return (  
    <section 
      id='tasks' 
      className={`flex flex-col items-center h-auto w-full text-white rounded-md  ${className}`}
    >
        <p className='font-bold text-3xl'>{count}</p>
        <p className='text-xs font-semibold text-center shrink-0'>{title}</p>
    </section>
  )
}

function AlertCard({text = 'text', className = ''}) {
  return (
    <section className={`flex bg-yellow-50 border border-l-4 text-sm text-yellow-800 border-yellow-300 w-full cursor-pointer
                       p-1 items-center n h-auto shadow-sm hover:cursor-default ${className}`}>
      <Icon dataFeather='alert-circle' className='text-yellow-800'/>
      <p>{text}</p>
    </section>
  )
}

function CreateCard({ title = "Title", description = "Description", onClick, color = 'green', className = ''}) {
  return (
    <div
      className={`flex flex-col bg-green-50 rounded-md overflow-hidden text-green-700 hover:cursor-pointer hover:border-opacity-50
      flex-grow justify-between border-2 gap-4 border-green-800 border-opacity-30 hover:bg-green-100 p-4 font-semibold h-[12rem] min-w-[9rem] ${className}`}
      onClick={onClick}
    >
      <span className="flex flex-col justify-between gap-4 w-full h-full items-center">
          <span className='self-start flex flex-col gap-1 justify-between w-full'>
            <span className="flex gap-4 mb-2 justify-between items-center">
              <h2 className='font-bold text-sm'>{title}</h2>
              <Icon dataFeather='plus' className={`text-green-800`}/>
            </span>
            <p className='text-sm'>{description}</p>
          </span>
      </span>
    </div>
  );
}

function ProjectCard({projectData}) {
  const navigate = useNavigate();
  const [showPopUp, setShowPopUp] = useState(false);

  const togglePopUp = () => { 
    setShowPopUp(!showPopUp);
  };

  const handleHeaderToProject = () => {
    if (!projectData.id) {
      console.error("Error: Project Id missing");
      return;
    };

    navigate(`/project/${projectData.id}`)
  };

  return (
    
    <div
      className="flex flex-col bg-white rounded-md cursor-pointer hover:bg-green-50
      flex-grow justify-between border gap-2 border-green-600 p-3 h-[12rem] min-w-[9rem]"
      onClick={handleHeaderToProject}
    >
      <section className="flex flex-col items-start w-full">
          <section className='relative w-full'>
            <IconTitleSection title={projectData.title} dataFeather='more-vertical' iconOnClick={togglePopUp} underTitle={projectData.date}/>
            {showPopUp && <Popup closeModal={togglePopUp} projectData={projectData} collectionName='projects' />}
          </section>
      </section>

      <section className="flex flex-col justify-between h-full w-full overflow-hidden overflow-y-scroll">
        <IconText text={projectData.description} color='green' border />
      </section>
      <span className="flex flex-wrap gap-1">
        <IconText text={projectData.type} color="slate" className="" />
        <IconText text={projectData.status} color="blue" className="" />
      </span>
    </div>
  );
}

function NoteCard({
  className = "",
  noteData,
  file,
}) {



  const initialVisibilityState = {
    popUp: false,
    noteFocus: false,
  }

  function reducer(state, action) {
    switch(action.type){
      case 'TOGGLE_POPUP':
        return { ...state, popUp: !state.popUp };
      case 'NOTE_FOCUS':
        return { ...state, noteFocus: !state.noteFocus};
      default:
        return state;
    }
  }

  const [visibility, dispatch] = useReducer(reducer, initialVisibilityState);

  return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          dispatch({ type: 'NOTE_FOCUS' });
        }}
        className={`flex flex-col bg-white rounded-md cursor-pointer hover:bg-yellow-50
      flex-grow justify-between border gap-2 border-yellow-600 p-3 h-[12rem] min-w-[9rem]${className}`}
      >
      {visibility.noteFocus && 
        <NoteFocus closeModal={() => dispatch({ type: 'NOTE_FOCUS' })} noteData={noteData} 
      />}
        <section className="flex-grow w-full">
          <div className='relative'>
            <IconTitleSection 
              title={noteData.title} 
              dataFeather={'more-vertical'} 
              iconOnClick={() => dispatch({ type: 'TOGGLE_POPUP'})}
              underTitle={noteData.date}
            />
            {visibility.popUp &&
              <Popup closeModal={() => dispatch({ type: 'TOGGLE_POPUP'})} noteData={noteData} className='' collectionName='notes'/>
            }
          </div>
          <div id="note-card-text" className="flex flex-col justify-between h-full w-full overflow-hidden overflow-y-scroll">
            <IconText text={noteData.message} border/>
            {file && (
              <span className="block mt-2 text-gray-500 text-xs">
                Attached File: {file}
              </span>
            )}
          </div>
        </section>

        <div className="flex flex-wrap w-full gap-1 text-xs text-gray-600 font-semibold pt-1 max-w-full overflow-x-scroll">
          <IconText text={noteData.owner} />
          <IconText text={noteData['project-title']} />
          <IconText text={noteData.status} />
        </div>
      </div>

      
  );
}


function UserCard({ className = '', user, onStateChange, withEmail = true, isActive = false, onClick=null }) {
  const [localActive, setLocalActive] = useState(isActive);

  useEffect(() => {
    setLocalActive(isActive);
  }, [isActive]);

  const toggleIsActive = () => {
    const newState = !localActive;
    setLocalActive(newState);

    if (onStateChange && user) {
      const { username, email, uid, photoURL } = user;
      onStateChange({ username, email, uid, photoURL, isActive: newState });
    }
  };

  return (
    <section className={`flex items-center border w-full max-w-[18rem] h-fit rounded-md bg-white ${className}`} onClick={onClick ? onClick : toggleIsActive} >
      <span
        className={`flex font-semibold px-3 gap-2 w-full h-full p-2 rounded-md hover:bg-green-50 items-center hover:cursor-pointer ${localActive ? 'bg-green-700 hover:bg-green-700 text-white' : ''}`}
      >
        <img className="w-6 h-6 rounded-full" src={user?.photoURL?? null} alt="user-icon" />
        <span className="flex flex-col w-full">
          <p className="text-sm truncate">{user?.username ?? 'user'}</p>
          {withEmail && <p className="text-xs opacity-80 truncate">{user?.email ?? null}</p>}
        </span>
      </span>
    </section>
  );
}

function EveryOneCard({projectData, className, onStateChange, isActive = false}){
  const [localActive, setLocalActive] = useState(isActive);

  useEffect(() => {
    setLocalActive(isActive);
  }, [isActive]);

  const toggleIsActive = () => {
    const newState = !localActive;
    setLocalActive(newState);

    if (onStateChange && projectData) {
      const memberNames = projectData.team.map((member) => member.username)
      const { team } = projectData;
      onStateChange({ tag: 'everyone', team, memberNames, isActive: newState });
    }
  };
  
  return (
    <section className={`flex border w-full max-w-[18rem] h-fit rounded-lg bg-white ${className}`}>
      <span
        className={`flex flex-col font-semibold px-3 gap-2 w-full h-full p-2 rounded-md hover:bg-green-50 hover:cursor-pointer ${localActive ? 'bg-green-700 hover:bg-green-700 text-white' : ''}`}
        onClick={toggleIsActive}
      >   
      <span className='flex gap-1 w-full p-1 rounded-md'>
        {!projectData.team.length > 0 ? (
          null
        ) : projectData.team && projectData.team.map((member) => (
          <IconUser key={member.uid} user={member} className='border-2' />
        ))}
      </span>

      <p className='text-sm'>@everyone</p>
      </span>
    </section>
  );
}

function TaskCard({taskData, className}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [visibility, setVisbility] = useState({
    popUp: false,
    taskFocus: false,
  });

  const toggleVisbility = (section) => {
    setVisbility((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const borderColor = 
    taskData.status === 'In-progress' ? 'border-green-700' : 
    taskData.status === 'To-review'   ? 'border-blue-700' : 
    'border-gray-300';

  if(!taskData) return <span className='text-sm bg-red-50 p-1 w-fit text-red-700'>Cannot load task info</span>

  return (
    <div 
      className={`flex flex-col bg-white rounded-md h-auto shadow-md border-opacity-75
        w-full justify-between border p-2 hover:cursor-pointer hover:shadow-lg ${borderColor} ${className}`}
      onClick={() => {
        if (location.pathname === '/Home') {
            navigate(`/Project/${taskData['project-id']}`);
        } else {
          toggleVisbility('taskFocus')
        }
      }}
    >
    {visibility.taskFocus && 
      <TaskFocus 
        closeModal={() => toggleVisbility('taskFocus')} 
        collectionName='tasks' 
        taskData={taskData}
      />
    }

      <span className='flex flex-col'>

        <section className="relative">
          <IconTitleSection title={taskData.title} underTitle={taskData.deadline} dataFeather='more-vertical' iconOnClick={() => toggleVisbility('popUp')} />
          {visibility.popUp &&
            <Popup
              taskData={taskData}
              closeModal={() => toggleVisbility('popUp')}
              collectionName='tasks'
            />
          }
        </section>
      </span>

      <IconText border text={taskData.description} />
      
      <section className="flex gap-1 items-center justify-between mt-2">
        <section className='flex flex-wrap gap-1'>
          <IconText text={taskData.status}/>
          <IconText text={`Priority: ${taskData.priority}`}/>
          {taskData.category && (
            <IconText text={`#${taskData.category}`} />
          )}
          <span className='flex text-xs font-semibold text-gray-600 flex-wrap'>
            {(location.pathname == '/Home') ? (
              <IconText text={`Task In: ${taskData['project-title']}`} />
            ) : (
              null
            )}
          </span>
        </section>

        <span id="user" className='flex p-1 gap-1 bg-slate-100 rounded-full w-fit' onClick={(e) => e.stopPropagation()}>
          {taskData.team && taskData.team.length > 0 ? (
            taskData.team.map((member) => (
              <IconUser key={member.uid} user={member} className='h-6 w-6' />
            ))
          ) : (
            <span className='bg-red-50 text-red-800 px-1 text-xs'>No members assigned</span>
          )}
      </span>

      </section>
    </div>
  )
}

function ProgressAlertCard({title = 'Task Title', description = 'Lorem ipsum dolor sit amet. Example text should go here Lorem ipsum dolor sit amet.'}) {
  const [showPopUp, setShowPopUp] = useState(false);
  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  };

  return (
    <div className="flex flex-col bg-white rounded-md h-auto border-opacity-50
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
      className={`flex flex-col bg-white p-4 gap-2 h-[15rem] justify-between w-full rounded-md border-opacity-50 
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
      <span className='w-full h-full bg-gray-50 rounded-md'></span>

      <Button text='Open Canvas' onClick={toggleShowCanvas} dataFeather='maximize'/>
      {showCanvas && <MainCanvas closeModal={toggleShowCanvas}/>}
    </div>
  )
}


export { AlertCard, CanvasCard, CountCard, CreateCard, EveryOneCard, NoteCard, ProgressAlertCard, ProjectCard, SummaryCard, TaskCard, UserCard };

