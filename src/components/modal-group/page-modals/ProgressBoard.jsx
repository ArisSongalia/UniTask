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
  { key: 'toDo',       status: 'To-do',       label: 'To-do',       color: 'slate',   loaderColor: '#94a3b8' },
  { key: 'inProgress', status: 'In-progress', label: 'In Progress', color: 'blue',    loaderColor: '#3b82f6' },
  { key: 'toReview',   status: 'To-review',   label: 'To Review',   color: 'amber',   loaderColor: '#f59e0b' },
  { key: 'finished',   status: 'Finished',    label: 'Finished',    color: 'emerald', loaderColor: '#10b981' },
]

const theme = (color) => ({
  border:   `border-${color}-300`,
  bg:       `bg-${color}-50`,
  headerBg: `bg-${color}-100`,
  dot:      `bg-${color}-500`,
  badge:    `bg-${color}-200 text-${color}-800`,
})

export default function ProgressBoard() {
  const [showCreateTask, setShowCreateTask] = useState(false)
  const { key } = useReloadContext()
  const { projectId } = useParams()

  const makeWhere = (status) => useMemo(
    () => [where('status', '==', status), where('project-id', '==', projectId)],
    [projectId]
  )

  const cols = [
    { ...COLUMNS[0], ...useFetchTaskData(makeWhere('To-do'),       key) },
    { ...COLUMNS[1], ...useFetchTaskData(makeWhere('In-progress'),  key) },
    { ...COLUMNS[2], ...useFetchTaskData(makeWhere('To-review'),    key) },
    { ...COLUMNS[3], ...useFetchTaskData(makeWhere('Finished'),     key) },
  ]

  if (!projectId) return <div className="flex items-center justify-center h-full w-full"><BarLoader color="#3b82f6" /></div>

  return (
    <div className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full w-full">
      <IconTitleSection
        iconText='Create-task'
        dataFeather='plus'
        extraIcon={<ReloadIcon />}
        iconOnClick={() => setShowCreateTask(p => !p)}
        title='Progress Board'
        className='flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50'
        titleClassName='text-lg font-merriweather'
      />
      {showCreateTask && <CreateTask closeModal={() => setShowCreateTask(false)} />}

      <section className="flex gap-3 flex-1 overflow-x-auto p-4 pt-0 min-h-0">
      {cols.map((col) => {
        const { border, bg, headerBg, dot, badge } = theme(col.color)
        return (
          <div key={col.key} className={`flex flex-col min-w-[15rem] w-full rounded-xl border ${border} ${bg} flex-1 min-h-0 overflow-hidden shadow-sm`}>

            <div className={`${headerBg} px-3 pt-3 pb-2 border-b ${border}`}>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${dot}`} />
                  <span className="text-sm font-semibold text-gray-700 tracking-wide">{col.label}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badge}`}>{col.taskData?.length ?? 0}</span>
              </div>
              {col.loading && <BarLoader color={col.loaderColor} width="100%" height={2} />}
            </div>

            <section className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 p-2">
              {!col.loading && col.taskData?.length === 0 && (
                <div className="flex flex-col items-center justify-center flex-1 py-8 opacity-40">
                  <Icon dataFeather='x-square' />
                  <p className="text-xs text-gray-400">No tasks here</p>
                </div>
              )}
              {!col.loading && col.taskData?.map((taskData) => <TaskCard key={taskData.id} taskData={taskData} />)}
            </section>
          </div>
        )
      })}
      </section>
    </div>
  )
}