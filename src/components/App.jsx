import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import { ReloadProvider } from './ReloadContext';
import Navbar from './Navbar';
import Project from './Project';


function App() {
  return (
      <ReloadProvider>
        <Navbar />
        <div
          id="main-container"
          className="flex w-full p-4 h-[92vh] gap-4 max-w- justify-center"
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Project" element={<Project />} />
          </Routes>
        </div>
      </ReloadProvider>
  );
}

export default App;
