import React from 'react'
import ProgressBoard from '../components/ProgressBoard'
import TaskSideBar from '../components/TaskSideBar'

function Project() {
  return (
    <div className='flex w-full max-w-screen-2xl h-[88vh] gap-4'>
        <ProgressBoard />
        <TaskSideBar />
    </div>
  )
}

export default Project