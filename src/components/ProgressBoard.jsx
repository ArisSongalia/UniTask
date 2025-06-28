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
import { CompletedTab } from './modal-group/Modal'
import { ButtonIcon } from './Button'

function ProgressBoard() {
  const [showPopUp, setShowPopUp] = useState(false);
  const { key } = useReloadContext();
  const [showCompletedTab, setShowCompletedTab] = useState(false);
  const activeProjectId = localStorage.getItem('activeProjectId');
  const activeProjectWhere = where('project-id', '==', activeProjectId);

  const toggleShowCompletedTab = () => {
    setShowCompletedTab(!showCompletedTab);
  };

  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  };

  const whereToDo = useMemo(() => [
    where("status", "==", "To-do"),
    where("project-id", "==", activeProjectId)
  ], [activeProjectId]);
  
  const whereActive = useMemo(() => [
    where("status", "==", "In-progress"),
    where("project-id", "==", activeProjectId)
  ], [activeProjectId]);
  
  const whereFinished = useMemo(() => [
    where("status", "==", "Finished"),
    where("project-id", "==", activeProjectId)
  ], [activeProjectId]);

  const { taskData: toDoTasks, loading: loadingToDo } = useFetchTaskData(whereToDo, key);
  const { taskData: inProgressTasks, loading: loadingInProgress } = useFetchTaskData(whereActive, key);
  const { taskData: finishedTasks, loading: loadingFinished } = useFetchTaskData(whereFinished, key);

  console.log("Active Project ID:", activeProjectId);

  return (
    <div className="flex flex-col bg-white rounded-md overflow-hidden h-full w-full shadow-sm flex-grow-0">
      <section className='title-section flex p-4 justify-between'>
        <h2 className='font-semibold max-w-[80%]'>Progress Board</h2>
        <span className='flex gap-2 items-center'>
          <ReloadIcon />
          <IconAction dataFeather='check-square' iconOnClick={toggleShowCompletedTab} />
          {showCompletedTab && <CompletedTab taskData={finishedTasks} closeModal={toggleShowCompletedTab} />}
          <ButtonIcon
            text='Create Task'
            dataFeather='plus'
            onClick={togglePopUp}
            className='w-fit'
          />
        </span>
      </section>

      {showPopUp && <CreateTask closeModal={togglePopUp} />}

      <section
        id="task-board-container"
        className="flex gap-2 h-full w-full bg-2 px-4 rounded-md overflow-x-auto"
      >
        {/* To-do Column */}
        <div className="flex flex-col h-full bg-gray-50 min-w-[16rem] w-full rounded-md p-2 overflow-y-auto">
          <DisplayTitleSection
            title="To-do"
            className="text-sm"
            displayClassName="bg-yellow-100 text-yellow-900"
            displayCount={toDoTasks.length}
          />
          <section id="To-do" className="flex flex-col gap-2 h-full">
            {loadingToDo ? (
              <BarLoader color="#228B22" size={20} />
            ) : (
              toDoTasks.map((taskData) => (
                <TaskCard key={taskData.id} {...taskData} />
              ))
            )}
          </section>
        </div>

        {/* In-progress Column */}
        <div className="flex flex-col h-full bg-gray-50 min-w-[16rem] rounded-md p-2 overflow-y-auto w-full">
          <DisplayTitleSection
            title="In-progress"
            className="text-sm"
            displayClassName="bg-blue-100 text-blue-900"
            displayCount={inProgressTasks.length}
          />
          <section id="in-progress" className="flex flex-col gap-2">
            {loadingInProgress ? (
              <BarLoader color="#228B22" size={20} />
            ) : (
              inProgressTasks.map((taskData) => (
                <TaskCard key={taskData.id} {...taskData} />
              ))
            )}
          </section>
        </div>

        {/* To-review Column */}
        <div className="flex flex-col h-full bg-gray-50 min-w-[16rem] rounded-md p-2 overflow-y-auto w-full">
          <DisplayTitleSection
            title="To-review"
            className="text-sm"
            displayClassName="bg-violet-100 text-violet-900"
            displayCount={inProgressTasks.length}
          />
          <section id="To-review" className="flex flex-col gap-2">
            {loadingInProgress ? (
              <BarLoader color="#228B22" size={20} />
            ) : (
              inProgressTasks.map((taskData) => (
                <TaskCard key={taskData.id} {...taskData} />
              ))
            )}
          </section>
        </div>
      </section>

    </div>
  );
}


export default ProgressBoard