import React from 'react'
import { SummaryCard } from './Cards';
import AssignedTasks from './AssignedTasks';
import { IconAction } from './Icon';
import { IconTitleSection } from './TitleSection';

function HomeSideBar({className = '', closeModal = {}}) {
  return (
    <div id="header" className={`flex w-full h-auto flex-col gap-2 bg-slate-100 ${className}`}>
    <IconTitleSection 
      title='Data' 
      dataFeather='x' 
      iconOnClick={closeModal} 
      className='p-4 pb-0 bg-white' 
      titleClassName='text-lg font-bold text-green-800' 
    />
      <SummaryCard title="Daily Summary"/>
      <AssignedTasks />
    </div>
  )
}

export default HomeSideBar