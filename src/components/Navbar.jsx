import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import unitask from '../assets/unitask.svg';
import { Signup } from './Modal';
import TaskNavBar from './TaskNavBar';
import UserCard from './UserCard';
import { UserProfile } from './Modal';
import Button from './Button';

function Navbar() {
  const [showPopUp, setShowPopUp] = useState(false);
  const location = useLocation(); 

  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  };

  if (location.pathname === '/TaskMain') {
    return <TaskNavBar />; 
  }

  return (
    <section className="bg-white flex items-center justify-center w-full h-auto sticky top-0 shadow-sm">
      <div className="flex items-center justify-between w-full p-4 max-w-screen-2xl">
        <span className="flex items-center gap-2">
          <img src={unitask} alt="UniTask Logo" className="w-8 h-8" />
          <a href="#" className="text-green-900 text-lg font-bold">UniTask</a>
        </span>
  
        <Button
          onClick={togglePopUp}
          className="text-green-900 text-sm mx-4 font-bold hover:cursor-pointer hover:text-green-700"
          text='Sign-up'
        />
        {showPopUp && <Signup closeModal={togglePopUp}/>}
 
      </div>
    </section>
  );
}

export default Navbar;
