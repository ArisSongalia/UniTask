import React from 'react'
import RecentTasks from './RecentTasks';
import HomeSideBar from './HomeSideBar';

function Home() {
  return (
    <div className='flex w-full max-w-screen-2xl h-[90vh] gap-4'>
      <RecentTasks />
      <HomeSideBar />
    </div>
  )
}

export default Home