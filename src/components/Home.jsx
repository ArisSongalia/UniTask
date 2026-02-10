import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { SortProvider } from '../context/SortContext';
import HomeSideBar from './HomeSideBar';
import Navbar from './Navbar';
import RecentTasks from './RecentTasks';

function Home() {
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();
  const location = useLocation();
  const isProjectView = location.pathname === '/Home/Project';

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
      {!isProjectView && (
        <SortProvider>
          <div className="flex flex-grow w-full h-[calc(100vh-5rem)] gap-2 max-w-screen-2xl justify-center">
            <RecentTasks />
            <HomeSideBar className='hidden lg:flex'/>
          </div>
        </SortProvider>
      )}
      <Outlet />
    </div>
  );
}

export default Home;
