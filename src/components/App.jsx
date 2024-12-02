import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import HomeSideBar from './HomeSideBar'
import RecentTasks from './RecentTasks'
import TaskMain from '../pages/TaskMain';

function App({}) {
  return (
    <div id="main-container" 
      className={`flex max-w-screen-2xl w-full p-4 h-[90vh] gap-4 self-center justify-center`}
      >
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <RecentTasks />
                  <HomeSideBar /> 
                </>
              }
            />
            <Route path="/TaskMain" element={<TaskMain />} />
          </Routes>
    </div>
  )
}

export default App