import React from 'react'
import ProgressBoard from '../components/ProgressBoard'
import TaskSideBar from '../components/TaskSideBar'

function Project() {
  return (
    <div className='flex w-auto h-full self-center justify-center'>
      <section className='flex max-w-screen-2xl h-[85vh] gap-4'>
        <ProgressBoard />
        <TaskSideBar />
      </section>
    </div>
  )
}

export default Project