import React from 'react'
import NoteSection from './NoteSection'
import CanvasSection from './CanvasSection'
import { IconTitleSection } from './TitleSection'

function TaskSideBar({ className = "", closeModal = {} }) {
  return (
    <span className={`flex w-full h-full flex-col gap-2 bg-slate-100 ${className}`}>
      <IconTitleSection 
        title='Utilities' 
        dataFeather='x' 
        iconOnClick={closeModal} 
        className='p-4 pb-0 bg-white' 
        titleClassName='text-lg font bold text-green-800' 
      />
      <NoteSection />
      <CanvasSection />
    </span>
  )
}

export default TaskSideBar