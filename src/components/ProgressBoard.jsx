import React, {useState} from 'react'
import { ProgressCard } from './Cards'
import { DisplayTitleSection, IconTitleSection } from './TitleSection'
import { CreateTask } from './modal-group/Modal'
import { useFetchTaskData } from '../services/FetchData'
import { BarLoader } from 'react-spinners'
import { useReloadContext } from '../context/ReloadContext'
import { ReloadIcon } from './ReloadComponent'

function ProgressBoard() {
  const [loading, setLoading] = useState(true);
  const [taskData, setTaskData] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false);
  const { key } = useReloadContext();

  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  };

  useFetchTaskData(setTaskData, setLoading, key);

  return (
    <section className='flex flex-col bg-white rounded-md p-4 h-auto w-full overflow-hidden shadow-sm'>
      <IconTitleSection 
        dataFeather='plus' 
        title='Progress Board' 
        buttonText='Create Task' 
        iconOnClick={togglePopUp}
        extraIcon={<ReloadIcon />}
      />
      {showPopUp && <CreateTask closeModal={togglePopUp}/>}
      <section className='flex gap-2 pr-2 overflow-y-scroll'>
        <span className='flex flex-col bg-gray-50 h-full w-full rounded-lg p-2 pt-4 overflow-scroll'>
        <DisplayTitleSection title='To-do' className='text-sm' displayClassName='bg-yellow-100 text-yellow-900' displayCount='0'/>
          <section id='To-do' className='flex flex-col gap-2 '>

            {loading ? (
              <span><BarLoader color='#228B22' size={20} /></span>
            ) : (
              taskData.length > 0 && (
                taskData.map((taskData, index) => (
                  <ProgressCard 
                    key={index}
                    title={taskData['task-title']}
                    description={taskData['task-description']}
                    deadline={taskData['task-deadline']}
                    team={taskData['task-team']}
                  />
                ))
              )
            )}

          </section>
        </span>

        <span className='flex flex-col h-full w-full bg-gray-50 rounded-lg p-2 pt-4'>
          <DisplayTitleSection title='In-progress' className='text-sm' displayClassName='bg-blue-100 text-blue-900' displayCount='0'/>
          <section id='in-progress' className='flex flex-col gap-2'>

          </section>
        </span>

        <span className='flex flex-col h-full w-full bg-gray-50 rounded-lg p-2 pt-4'>
          <DisplayTitleSection title='Done'className='text-sm' displayClassName='bg-green-200 text-green-900' displayCount='0'/>
          <section id='completed' className='flex flex-col gap-2'>

          </section>
        </span>
      </section>

    </section>
  )
}

export default ProgressBoard