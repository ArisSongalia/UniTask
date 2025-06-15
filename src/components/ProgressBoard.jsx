import React, {useEffect, useState, useMemo} from 'react'
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
import { CompletedTab } from './modal-group/Modal'

function ProgressBoard() {
  const [showPopUp, setShowPopUp] = useState(false);
  const { key } = useReloadContext();
  const [showCompletedTab, setShowCompletedTab] = useState(false);

  const toggleShowCompletedTab = () => {
    setShowCompletedTab(!showCompletedTab);
  };

  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  };

  const whereToDo = useMemo(() => where("task-status", "==", "To-do"), []);
  const whereActive = useMemo(() => where("task-status", "==", "In-progress"), []);
  const whereFinished = useMemo(() => where("task-status", "==", "Finished"), []);

  const { taskData: toDoTasks, loading: loadingToDo } = useFetchTaskData(whereToDo, key);
  const { taskData: inProgressTasks, loading: loadingInProgress } = useFetchTaskData(whereActive, key);
  const { taskData: finishedTasks, loading: loadingFinished } = useFetchTaskData(whereFinished, key);

  return (
    <div className='flex flex-col bg-white rounded-md p-4 h-full w-full overflow-hidden shadow-sm flex-grow-0'>
      <section className='title-section flex mb-4 justify-between'>
        <h2 className='font-semibold max-w-[80%] overflow-hidden overflow-ellipsis'>Progress Board</h2>
        <span className='flex gap-2 items-center'>
          <ReloadIcon />
          <IconAction dataFeather='check-square' iconOnClick={toggleShowCompletedTab} />
          {showCompletedTab && <CompletedTab taskData={finishedTasks} closeModal={toggleShowCompletedTab} />}
          <Button
            text='Create Task'
            dataFeather='plus'
            onClick={togglePopUp}
            className='w-fit'
          />
        </span>
      </section>

      {showPopUp && <CreateTask closeModal={togglePopUp} />}

      <section className='flex gap-2 h-full w-full bg-[#fafafa] px-4 rounded-lg'>

        {/* To-do Column */}
        <span className='flex flex-col h-full w-full pt-4 pr-2 border-r-2 border-slate-200 overflow-y-scroll'>
          <DisplayTitleSection
            title='To-do'
            className='text-sm'
            displayClassName='bg-yellow-100 text-yellow-900'
            displayCount={toDoTasks.length}
          />
          <section id='To-do' className='flex flex-col gap-2 h-full'>
            {loadingToDo ? (
              <BarLoader color='#228B22' size={20} />
            ) : (
              toDoTasks.map((taskData) => (
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
            )}
          </section>
        </span>

        {/* In-progress Column */}
        <span className='flex flex-col h-full w-full pl-2 pt-4'>
          <DisplayTitleSection
            title='In-progress'
            className='text-sm'
            displayClassName='bg-blue-100 text-blue-900'
            displayCount={inProgressTasks.length}
          />
          <section id='in-progress' className='flex flex-col gap-2'>
            {loadingInProgress ? (
              <BarLoader color='#228B22' size={20} />
            ) : (
              inProgressTasks.map((taskData) => (
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
            )}
          </section>
        </span>

      </section>
    </div>
  );
}


export default ProgressBoard