import React from 'react'
import AlertCard from './Cards';
import AssignedTasks from './AssignedTasks';

function HomeSideBar({}) {
  return (
    <div id="header" className={'flex w-full max-w-[30%] h-auto flex-col gap-2'}>
      <AlertCard text="Daily Summary" />
      <AssignedTasks />
    </div>
  )
}

export default HomeSideBar