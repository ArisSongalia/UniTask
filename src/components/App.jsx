import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Project from './Project';
import { SignIn, SignUp } from './modal-group/ModalAuth';


function App() {
  return (
        <div
          id="main-container"
          className='flex w-full h-full justify-center'
        >
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/Project' element={<Project />} />
            <Route path='/Sign-In' element={<SignIn />} />
            <Route path='/Sign-Up' element={<SignUp />} />
          </Routes>
        </div>
  );
}

export default App;
