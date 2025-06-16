import React from 'react'
import { SummaryCard } from './Cards';
import AssignedTasks from './AssignedTasks';

function HomeSideBar({className = ''}) {
  return (
    <div id="header" className={`flex w-full max-w-[30%] h-auto flex-col gap-2 ${className}`}>
      <SummaryCard title="Daily Summary" />
      <AssignedTasks />
    </div>
  )
}

export default HomeSideBar