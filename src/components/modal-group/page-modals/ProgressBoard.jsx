import { where } from 'firebase/firestore'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BarLoader } from 'react-spinners'
import { useReloadContext } from '../../../context/ReloadContext'
import { useFetchTaskData } from '../../../services/FetchData'
import { TaskCard } from '../../Cards'
import Icon from '../../Icon'
import { ReloadIcon } from '../../ReloadComponent'
import { IconTitleSection } from '../../TitleSection'
import CreateTask from '../create-modals/CreateTask'

const COLUMNS = [
  {
    key: 'toDo',
    status: 'To-do',
    label: 'To-do',
    border: 'border-slate-300',
    bg: 'bg-slate-50',
    headerBg: 'bg-slate-100',
    dot: 'bg-slate-400',
    badge: 'bg-slate-200 text-slate-700',
    loaderColor: '#94a3b8',
  },
  {
    key: 'inProgress',
    status: 'In-progress',
    label: 'In Progress',
    border: 'border-blue-300',
    bg: 'bg-blue-50',
    headerBg: 'bg-blue-100',
    dot: 'bg-blue-500',
    badge: 'bg-blue-200 text-blue-800',
    loaderColor: '#3b82f6',
  },
  {
    key: 'toReview',
    status: 'To-review',
    label: 'To Review',
    border: 'border-amber-300',
    bg: 'bg-amber-50',
    headerBg: 'bg-amber-100',
    dot: 'bg-amber-500',
    badge: 'bg-amber-200 text-amber-800',
    loaderColor: '#f59e0b',
  },
  {
    key: 'finished',
    status: 'Finished',
    label: 'Finished',
    border: 'border-emerald-300',
    bg: 'bg-emerald-50',
    headerBg: 'bg-emerald-100',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-200 text-emerald-800',
    loaderColor: '#10b981',
  },
]

function ColumnHeader({ label, dot, badge, count }) {
  return (
    <div className="flex items-center justify-between mb-3 px-1">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${dot}`} />
        <span className="text-sm font-semibold text-gray-700 tracking-wide">{label}</span>
      </div>
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badge}`}>
        {count}
      </span>
    </div>
  )
}

function TaskColumn({ column, tasks, loading }) {
  const { label, border, bg, headerBg, dot, badge, loaderColor } = column

  return (
    <div
      className={`
        flex flex-col min-w-[15rem] w-full rounded-xl border ${border} ${bg}
        flex-1 min-h-0 overflow-hidden shadow-sm
      `}
    >
      {/* Column header */}
      <div className={`${headerBg} px-3 pt-3 pb-2 border-b ${border}`}>
        <ColumnHeader label={label} dot={dot} badge={badge} count={tasks.length} />
        {loading && (
          <div className="mt-1">
            <BarLoader color={loaderColor} width="100%" height={2} />
          </div>
        )}
      </div>

      {/* Task list */}
      <section className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 p-2">
        {!loading && tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 py-8 opacity-40">
            <Icon dataFeather='x-square' />
            <p className="text-xs text-gray-400">No tasks here</p>
          </div>
        )}
        {!loading &&
          tasks.map((taskData) => <TaskCard key={taskData.id} taskData={taskData} />)}
      </section>
    </div>
  )
}

export default function ProgressBoard() {
  const [visibility, setVisibility] = useState({ createTask: false })
  const { key } = useReloadContext()
  const { projectId } = useParams()

  const toggleVisibility = (section) =>
    setVisibility((prev) => ({ ...prev, [section]: !prev[section] }))

  const whereToDo = useMemo(
    () => [where('status', '==', 'To-do'), where('project-id', '==', projectId)],
    [projectId]
  )
  const whereActive = useMemo(
    () => [where('status', '==', 'In-progress'), where('project-id', '==', projectId)],
    [projectId]
  )
  const whereToReview = useMemo(
    () => [where('status', '==', 'To-review'), where('project-id', '==', projectId)],
    [projectId]
  )
  const whereFinished = useMemo(
    () => [where('status', '==', 'Finished'), where('project-id', '==', projectId)],
    [projectId]
  )

  const { taskData: toDoTasks, loading: loadingToDo } = useFetchTaskData(whereToDo, key)
  const { taskData: inProgressTasks, loading: loadingInProgress } = useFetchTaskData(whereActive, key)
  const { taskData: toReviewTasks, loading: loadingToReview } = useFetchTaskData(whereToReview, key)
  const { taskData: finishedTasks, loading: loadingFinished } = useFetchTaskData(whereFinished, key)

  if (!projectId) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <BarLoader color="#3b82f6" />
      </div>
    )
  }

  const columns = [
    { column: COLUMNS[0], tasks: toDoTasks, loading: loadingToDo },
    { column: COLUMNS[1], tasks: inProgressTasks, loading: loadingInProgress },
    { column: COLUMNS[2], tasks: toReviewTasks, loading: loadingToReview },
    { column: COLUMNS[3], tasks: finishedTasks, loading: loadingFinished },
  ]


  return (
    <div className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full w-full">
      <IconTitleSection 
        iconText='Create-task'
        dataFeather='plus'
        extraIcon={<ReloadIcon />}
        iconOnClick={() => toggleVisibility('createTask')}
        title='Progress Board'
        className='flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50'
        titleClassName='text-lg font-merriweather'
      />
      {visibility.createTask && (
        <CreateTask closeModal={() => toggleVisibility('createTask')} />
      )}

      {/* Board */}
      <section className="flex gap-3 flex-1 overflow-x-auto p-4 pt-0 min-h-0">
        {columns.map(({ column, tasks, loading }) => (
          <TaskColumn
            key={column.key}
            column={column}
            tasks={tasks}
            loading={loading}
          />
        ))}
      </section>
    </div>
  )
}