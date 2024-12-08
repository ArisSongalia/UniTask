import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SignIn, SignUp } from './ModalAuth'
import HomeSideBar from './HomeSideBar'
import RecentTasks from './RecentTasks'
import TaskMain from '../pages/TaskMain';

function App({}) {
  return (
    <div id="main-container" 
      className={`flex max-w-screen-2xl w-full p-4 h-[90vh] gap-4 self-center justify-center`}
      >
          <Routes>
            <Route path="/" 
              element={
                <>
                  <RecentTasks />
                  <HomeSideBar /> 
                </>
              }
            />
            <Route path='/TaskMain' element={<TaskMain />} />
            <Route path='/SignUp' element={<SignUp />} />
            <Route path='/SignIn' element={<SignIn />} />
          </Routes>
    </div>
  )
}

export default App