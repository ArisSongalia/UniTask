import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import unitask from '../assets/unitask.svg';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { IconUser, IconAction } from './Icon';
import HomeSideBar from './HomeSideBar';


function Navbar() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [showPopUp, setShowPopUp] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (location.pathname === '/Project') {
    return null;
  }

  const toggleShowPopUp = () => {
    setShowPopUp(!showPopUp);
  }


  return (
    <section className="bg-white flex z-50 items-center justify-center w-full h-fit sticky top-0 shadow-sm">
      <div className="flex items-center justify-between w-full p-4 max-w-screen-2xl">
          <Link to="/" className="flex items-center gap-2 text-green-900 text-lg font-bold">
          <img src={unitask} alt="UniTask" className="w-6 h-6" />
          
            UniTask
          </Link>

        <span className="flex w-fit gap-2 items-center">
          {user ? (
            <>
              <IconUser user={user}/>       
            </>
          ) :
            null
          }

          <IconAction dataFeather='bar-chart-2' className='lg:hidden' iconOnClick={toggleShowPopUp} />
        </span>
      </div>
      {showPopUp && 
      <HomeSideBar 
        className='fixed top-0 left-0 w-full min-h-screen max-w-[100vw] z-40 bg-white lg:hidden'
        closeModal={toggleShowPopUp}
      />}
    </section>
  );
}

export default Navbar;
