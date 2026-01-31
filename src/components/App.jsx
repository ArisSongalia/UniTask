import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import { Navigate } from 'react-router-dom';
import Project from './Project';
import { SignIn, SignUp } from './modal-group/ModalAuth';


function App() {
  return (
        <div
          id="main-container"
          className=''
        >
          <Routes>
            <Route path="/" element={<Navigate to="/Home" replace />} />
            <Route path='/Home' element={<Home />} />
            <Route path='/project/:projectId' element={<Project />} />
            <Route path='/Sign-In' element={<SignIn />} />
            <Route path='/Sign-Up' element={<SignUp />} />
          </Routes>
        </div>
  );
}

export default App;
