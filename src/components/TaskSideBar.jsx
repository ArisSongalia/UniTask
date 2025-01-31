import React from 'react'
import NoteSection from './NoteSection'
import CanvasSection from './CanvasSection'

function TaskSideBar() {
  return (
    <span className='flex w-full max-w-[30%] h-auto flex-col gap-2'>
      <NoteSection />
      <CanvasSection />
    </span>
  )
}

export default TaskSideBar