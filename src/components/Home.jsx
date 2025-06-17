import React, { useEffect, useState } from 'react';
import RecentTasks from './RecentTasks';
import HomeSideBar from './HomeSideBar';
import Navbar from './Navbar';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        navigate('/Sign-In');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (user === undefined) return null;

  return (
    <div className="flex flex-col w-full h-[100vh] items-center overflow-auto">
      <Navbar />
      <div className="flex flex-grow w-full p-4 h-[calc(100vh-4rem)] gap-4 max-w-screen-2xl justify-center">
        <RecentTasks />
        <HomeSideBar className='hidden lg:flex'/>
      </div>
    </div>
  );
}

export default Home;
