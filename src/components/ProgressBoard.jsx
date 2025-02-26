import React, {useEffect, useState} from 'react'
import { TaskCard } from './Cards'
import { DisplayTitleSection, IconTitleSection } from './TitleSection'
import { CreateTask } from './modal-group/Modal'
import { useFetchTaskData } from '../services/FetchData'
import { BarLoader } from 'react-spinners'
import { useReloadContext } from '../context/ReloadContext'
import { ReloadIcon } from './ReloadComponent'
import { where } from 'firebase/firestore'
import { IconAction } from './Icon'
import Button from './Button'

function ProgressBoard() {
  const [loading, setLoading] = useState(true);
  const [taskData, setTaskData] = useState([]);
  const [activeTaskData, setActiveTaskData] = useState([])
  const [showPopUp, setShowPopUp] = useState(false);
  const { key, reloadComponent } = useReloadContext();

  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  };

  const whereToDo = where("task-status", "==", "To-do");
  useFetchTaskData(setTaskData, setLoading, key, whereToDo);

  const whereActive = where("task-status", "==", "In-progress")
  useFetchTaskData(setActiveTaskData, setLoading, key, whereActive);

  return (
    <div className='flex flex-col bg-white rounded-md p-4 h-full w-full overflow-hidden shadow-sm flex-grow-0'>

      <section className='title-section flex mb-4 justify-between'>
        <h2 className='font-semibold max-w-[80%] overflow-hidden overflow-ellipsis'>Progress Board</h2>
        <span className='flex gap-2 items-center'>
          <ReloadIcon />
          <IconAction dataFeather='check-square'/>
          <Button 
            text='Create Task' 
            dataFeather='plus'
            onClick={togglePopUp}
            className='w-fit'
          />
        </span>
      </section>
      {showPopUp && <CreateTask closeModal={togglePopUp}/>}

      <section className='flex gap-2 h-full w-full bg-[#fafafa] px-4 rounded-lg'>
        <span className='flex flex-col h-full w-full pt-4 pr-2 border-r-2 border-slate-200 overflow-y-scroll'>
        <DisplayTitleSection title='To-do' className='text-sm' displayClassName='bg-yellow-100 text-yellow-900' displayCount={taskData.length}/>
          <section id='To-do' className='flex flex-col gap-2 h-full'>
            {loading ? (
              <span><BarLoader color='#228B22' size={20} /></span>
            ) : (
              taskData.length > 0 && (
                taskData.map((taskData) => (
                  <TaskCard 
                    key={taskData['task-id']}
                    title={taskData['task-title']}
                    description={taskData['task-description']}
                    deadline={taskData['task-deadline']}
                    team={taskData['task-team']}
                    status={taskData['task-status']}
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
                activeTaskData.map((taskData) => (
                  <TaskCard 
                    key={taskData['task-id']}
                    title={taskData['task-title']}
                    description={taskData['task-description']}
                    deadline={taskData['task-deadline']}
                    team={taskData['task-team']}
                    status={taskData['task-status']}
                    id={taskData['task-id']}
                  />
                ))
              )
            )}
          </section>
        </span>
      </section>

    </div>
  )
}

export default ProgressBoard