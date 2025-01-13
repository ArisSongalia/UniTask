import React from 'react'
import RecentTasks from './RecentTasks';
import HomeSideBar from './HomeSideBar';
import Navbar from './Navbar';

function Home() {
  return (
    <div className="flex flex-col w-full h-[100vh] items-center">
      <Navbar />
      <div className='flex w-full p-4 h-full gap-4 max-w-screen-2xl justify-center'>
        <RecentTasks />
        <HomeSideBar />
      </div>
    </div>
  )
}

export default Home