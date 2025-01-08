import React from 'react'
import RecentTasks from './RecentTasks';
import HomeSideBar from './HomeSideBar';

function Home() {
  return (
    <div className='flex w-full p-4 h-[92vh] gap-4 max-w-screen-2xl justify-center'>
      <RecentTasks />
      <HomeSideBar />
    </div>
  )
}

export default Home