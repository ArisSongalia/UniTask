import React, {useState} from 'react'
import { TaskCard } from './Cards'
import { DisplayTitleSection, IconTitleSection } from './TitleSection'
import { CreateTask } from './modal-group/Modal'
import { useFetchTaskData } from '../services/FetchData'
import { BarLoader } from 'react-spinners'
import { useReloadContext } from '../context/ReloadContext'
import { ReloadIcon } from './ReloadComponent'
import { where } from 'firebase/firestore'

function ProgressBoard() {
  const [loading, setLoading] = useState(true);
  const [taskData, setTaskData] = useState([]);
  const [activeTaskData, setActiveTaskData] = useState([])
  const [showPopUp, setShowPopUp] = useState(false);
  const { key } = useReloadContext();

  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  };

  const whereToDo = where("task-status", "==", "to-do");
  useFetchTaskData(setTaskData, setLoading, key, whereToDo);

  const whereActive = where("task-status", "==", "in-progress")
  useFetchTaskData(setActiveTaskData, setLoading, key, whereActive);

  return (
    <section className='flex flex-col bg-white rounded-md p-4 h-full w-full overflow-hidden shadow-sm flex-grow-0'>
      <IconTitleSection 
        dataFeather='plus' 
        title='Progress Board' 
        buttonText='Create Task' 
        iconOnClick={togglePopUp}
        extraIcon={<ReloadIcon />}
      />
      {showPopUp && <CreateTask closeModal={togglePopUp}/>}
      <section className='flex gap-2 h-full bg-gray-50 p-4 rounded-lg'>
        <span className='flex flex-col h-full w-full pt-4 pr-2 border-r-2 border-gray-400 border-opacity-20 overflow-y-scroll'>
        <DisplayTitleSection title='To-do' className='text-sm' displayClassName='bg-yellow-100 text-yellow-900' displayCount={taskData.length}/>
          <section id='To-do' className='flex flex-col gap-2 h-full'>
            {loading ? (
              <span><BarLoader color='#228B22' size={20} /></span>
            ) : (
              taskData.length > 0 && (
                taskData.map((taskData, index) => (
                  <TaskCard 
                    key={index}
                    title={taskData['task-title']}
                    description={taskData['task-description']}
                    deadline={taskData['task-deadline']}
                    team={taskData['task-team']}
                    id={taskData['task-id']}
                  />
                ))
              )
            )}
          </section>
        </span>

        <span className='flex flex-col h-full w-full pl-2 pt-4'>
          <DisplayTitleSection title='In-progress' className='text-sm' displayClassName='bg-blue-100 text-blue-900' displayCount='0'/>
          <section id='in-progress' className='flex flex-col gap-2'>
            {loading ? (
              <span><BarLoader color='#228B22' size={20} /></span>
            ) : (
              activeTaskData.length > 0 && (
                activeTaskData.map((taskData, index) => (
                  <TaskCard 
                    key={index}
                    title={taskData['task-title']}
                    description={taskData['task-description']}
                    deadline={taskData['task-deadline']}
                    team={taskData['task-team']}
                    id={taskData['task-id']}
                  />
                ))
              )
            )}
          </section>
        </span>
      </section>

    </section>
  )
}

export default ProgressBoard