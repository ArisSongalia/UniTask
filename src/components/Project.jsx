import React from 'react'
import ProgressBoard from './ProgressBoard'
import TaskSideBar from '../components/TaskSideBar'

function Project() {
  return (
    <div className='flex w-full max-w-screen-2xl p-4 h-[90vh] gap-4'>
        <ProgressBoard />
        <TaskSideBar />
    </div>
  )
}

export default Project