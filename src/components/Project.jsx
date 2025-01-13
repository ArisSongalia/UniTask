import React from 'react'
import ProgressBoard from './ProgressBoard'
import TaskSideBar from '../components/TaskSideBar'
import TaskNavBar from './TaskNavBar'

function Project() {
  return (
    <div className='flex flex-col w-full h-[100vh] items-center'>
      <TaskNavBar />
      <div className='flex w-full p-4 h-full gap-4 max-w-screen-2xl justify-center'>
        <ProgressBoard />
        <TaskSideBar />
      </div>
    </div>
  )
}

export default Project