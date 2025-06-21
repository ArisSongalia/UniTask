import React from 'react'
import NoteSection from './NoteSection'
import CanvasSection from './CanvasSection'
import { IconTitleSection } from './TitleSection'

function TaskSideBar({ className = "", closeModal = () => {}}) {
  return (
    <span className={`flex w-full lg:w-[35rem] h-full flex-col gap-2 bg-slate-100 ${className}`}>
      <IconTitleSection 
        title='Utilities' 
        dataFeather='x' 
        iconOnClick={closeModal} 
        className='p-4 pb-0 bg-white mb-0 lg:hidden' 
        titleClassName='text-lg font bold text-green-800' 
      />
      <NoteSection />
      <CanvasSection />
    </span>
  )
}

export default TaskSideBar