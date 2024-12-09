import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import unitask from '../assets/unitask.svg';
import { SignIn, SignUp, handleSignOut } from './ModalAuth';
import TaskNavBar from './TaskNavBar';
import Button from './Button';

import UserCard from './UserCard';

function Navbar() {
  const [activeAuth, setActiveAuth] = useState(null);
  const closeModal = () => setActiveAuth(null);

  if (location.pathname === '/TaskMain') {
    return <TaskNavBar />; 
  }

  return (
    <section className="bg-white flex items-center justify-center w-full h-auto sticky top-0 shadow-sm">
      <div className="flex items-center justify-between w-full p-4 max-w-screen-2xl">
        <span className="flex items-center gap-2">
          <img src={unitask} alt="UniTask Logo" className="w-8 h-8" />
          <Link to="/" className="text-green-900 text-lg font-bold">
            UniTask
          </Link>
        </span>
  
        <span className="flex w-fit gap-2 items-center">
          <UserCard />

          <Button
            onClick={() => setActiveAuth('SignIn')}
            className="text-green-900 text-sm font-bold hover:cursor-pointer hover:text-green-700"
            text='Login'
          />
          {activeAuth === 'SignIn' && <SignIn closeModal={closeModal} switchToSignUp={() => setActiveAuth('SignUp')}/>}

          <Button
            onClick={() => setActiveAuth('SignUp')}
            className="text-green-900 text-sm font-bold hover:cursor-pointer hover:text-green-700"
            text='Register'
          />
          {activeAuth === 'SignUp' && <SignUp closeModal={closeModal} switchToSignIn={() => setActiveAuth('SignIn')}/>}

          <Button
            onClick={handleSignOut}
            className="text-green-900 text-sm font-bold hover:cursor-pointer hover:text-green-700"
            text='Sign-Out'
          />
        </span>
      </div>
    </section>
  );
}

export default Navbar;
