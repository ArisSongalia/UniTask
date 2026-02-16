import { where } from 'firebase/firestore'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BarLoader } from 'react-spinners'
import { useReloadContext } from '../context/ReloadContext'
import { useFetchTaskData } from '../services/FetchData'
import { ButtonIcon } from './Button'
import { TaskCard } from './Cards'
import { IconAction } from './Icon'
import { ReloadIcon } from './ReloadComponent'
import { DisplayTitleSection } from './TitleSection'
import { CompletedTab, CreateTask } from './modal-group/Modal'

export default function ProgressBoard() {
  const [visibility, setVisibility] = useState({
    completedTab: false,
    createTask: false,
  });

  const { key } = useReloadContext();
  const { projectId } = useParams();

  if (!projectId) {
    return <BarLoader>Loading...</BarLoader>;
  }

  const toggleVisibility = (section) => {
    setVisibility((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const whereToDo = useMemo(
    () => [where("status", "==", "To-do"), where("project-id", "==", projectId)],
    [projectId]
  );
  const whereActive = useMemo(
    () => [where("status", "==", "In-progress"), where("project-id", "==", projectId)],
    [projectId]
  );
  const whereToReview = useMemo(
    () => [where("status", "==", "To-review"), where("project-id", "==", projectId)],
    [projectId]
  );
  const whereFinished = useMemo(
    () => [where("status", "==", "Finished"), where("project-id", "==", projectId)],
    [projectId]
  );

  const { taskData: toDoTasks, loading: loadingToDo } = useFetchTaskData(whereToDo, key);
  const { taskData: inProgressTasks, loading: loadingInProgress } = useFetchTaskData(whereActive, key);
  const { taskData: toReviewTasks, loading: loadingToReview } = useFetchTaskData(whereToReview, key);
  const { taskData: finishedTasks, loading: loadingFinished } = useFetchTaskData(whereFinished, key);

  return (
    <div className="flex flex-col bg-white rounded-md overflow-hidden h-full shadow-md w-full">
      {/* Header */}
      <section className="title-section flex p-4 pb-0 justify-between text-gray-700">
        <h2 className="font-bold text-lg">Progress Board</h2>
        <span className="flex gap-2 items-center">
          <ReloadIcon />
          <IconAction dataFeather="check-square" iconOnClick={() => toggleVisibility("completedTab")} />
          {visibility.completedTab && (
            <CompletedTab
              taskData={finishedTasks}
              closeModal={() => toggleVisibility("completedTab")}
              loading={loadingFinished}
            />
          )}
          <ButtonIcon
            text="Create Task"
            dataFeather="plus"
            onClick={() => toggleVisibility("createTask")}
          />
          {visibility.createTask && <CreateTask closeModal={() => toggleVisibility("createTask")} />}
        </span>
      </section>

      {/* Task Columns */}
      <section
        id="task-board-container"
        className="flex gap-2 flex-1 overflow-x-auto p-4"
      >
        {/* To-do Column */}
        <div className="flex flex-col border border-dotted border-gray-500 bg-gray-50 min-w-[16rem] w-full rounded-md p-2 flex-1 min-h-0">
          <DisplayTitleSection
            title="To-do"
            className="text-sm"
            displayClassName="bg-yellow-100 text-yellow-900"
            displayCount={toDoTasks.length}
          />
          <section className="flex flex-col gap-2 overflow-auto flex-1 min-h-0">
            {loadingToDo ? (
              <BarLoader color="#228B22" size={20} />
            ) : (
              toDoTasks.map((taskData) => <TaskCard key={taskData.id} taskData={taskData} />)
            )}
          </section>
        </div>

        {/* In-progress Column */}
        <div className="flex flex-col border border-dotted border-green-600 bg-green-50 min-w-[16rem] w-full rounded-md p-2 flex-1 min-h-0">
          <DisplayTitleSection
            title="In-progress"
            className="text-sm"
            displayCount={inProgressTasks.length}
          />
          <section className="flex flex-col gap-2 overflow-auto flex-1 min-h-0">
            {loadingInProgress ? (
              <BarLoader color="#228B22" size={20} />
            ) : (
              inProgressTasks.map((taskData) => <TaskCard key={taskData.id} taskData={taskData} />)
            )}
          </section>
        </div>

        {/* To-review Column */}
        <div className="flex flex-col border border-dotted border-blue-600 bg-blue-50 min-w-[16rem] w-full rounded-md p-2 flex-1 min-h-0">
          <DisplayTitleSection
            title="To-review"
            className="text-sm"
            displayClassName="bg-violet-100 text-violet-900"
            displayCount={toReviewTasks.length}
          />
          <section className="flex flex-col gap-2 overflow-auto flex-1 min-h-0">
            {loadingToReview ? (
              <BarLoader color="#228B22" size={20} />
            ) : (
              toReviewTasks.map((taskData) => <TaskCard key={taskData.id} taskData={taskData} />)
            )}
          </section>
        </div>
      </section>
    </div>
  );
}