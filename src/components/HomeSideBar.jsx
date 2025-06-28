import React from 'react'
import { SummaryCard } from './Cards';
import AssignedTasks from './AssignedTasks';
import { IconAction } from './Icon';
import { IconTitleSection } from './TitleSection';

function HomeSideBar({className = '', closeModal = () => {} }) {
  return (
    <div id="header" className={`flex w-full lg:w-[35rem] h-full flex-col bg-gray-100 ${className}`}>
    <IconTitleSection 
      title='Data' 
      dataFeather='x' 
      iconOnClick={closeModal}
      className='p-4 pb-2 bg-white lg:hidden' 
      titleClassName='text-md font-bold' 
    />
    
    <SummaryCard title="Daily Summary"/>
    <AssignedTasks />
    </div>
  )
}

export default HomeSideBar