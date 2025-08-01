import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import unitask from '../assets/unitask.svg';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { IconUser, IconAction } from './Icon';
import HomeSideBar from './HomeSideBar';
import SocialSection from './SocialSection';


function Navbar() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [showPopUp, setShowPopUp] = useState(false)

  const [visibilitity, setVisbility] = useState({
    socialSection: false,
    sideBar: false,
  })

  const toggleVisibility = (section) => {
    setVisbility((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (location.pathname === '/Home/Project') {
    return null;
  }

  return (
    <section className="bg-white flex z-50 items-center justify-center w-full h-fit px-4 mb-2 sticky top-0 shadow-sm">
      <div className="flex relative items-center justify-between w-full py-3  max-w-screen-2xl">
        <Link to="/Home" className="flex items-center gap-2 text-green-900 text-lg font-bold">
        <img src={unitask} alt="UniTask" className="w-6 h-6" />
        
          UniTask
        </Link>

        <span className="flex w-fit gap-2 items-center">
          <IconAction dataFeather='message-square' iconOnClick={() => toggleVisibility('socialSection')} />
          {visibilitity.socialSection && <SocialSection closeModal={() => toggleVisibility('socialSection')} />}

          <IconAction dataFeather='bar-chart-2' className='lg:hidden' iconOnClick={() => toggleVisibility('sideBar')} />
          {visibilitity.sideBar && 
          <HomeSideBar 
            closeModal={() => toggleVisibility('sideBar')}
            className='fixed top-0 left-0 w-full min-h-screen max-w-[100vw] z-40 bg-white lg:hidden'
          />}

          {user ? (
            <IconUser user={user} className='h-7 w-7'/>    
          ) :
            null
          }
        </span>
      </div>
    </section>
  );
}

export default Navbar;
