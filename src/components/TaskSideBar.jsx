import React from 'react'
import NoteSection from './NoteSection'
import SocialSection from './SocialSection'

function TaskSideBar() {
  return (
    <span className='flex w-full max-w-[30%] h-auto flex-col gap-2'>
      <NoteSection />
      <SocialSection />
    </span>
  )
}

export default TaskSideBar