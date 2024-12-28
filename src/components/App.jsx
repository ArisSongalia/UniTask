import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomeSideBar from './HomeSideBar'
import RecentTasks from './RecentTasks'
import TaskMain from '../pages/TaskMain';
import { ReloadProvider } from './ReloadContext';


function App({}) {
  return (
    <div id="main-container" 
      className={`flex max-w-screen-2xl w-full p-4 h-[92vh] gap-4 self-center justify-center`}
      >
          <Routes>
            <Route path="/" 
              element={
                <>
                  <ReloadProvider>
                    <RecentTasks />
                  </ReloadProvider>

                  <HomeSideBar /> 
                </>
              }
            />
            <Route path='/TaskMain' element={<TaskMain />} />
          </Routes>
    </div>
  )
}

export default App