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
  <div className="flex flex-col h-screen w-full overflow-hidden">
    <Navbar />

    {!isProjectView && (
      <SortProvider>
        <div className="flex flex-1 min-h-0 w-full gap-2 max-w-screen-2xl mx-auto p-2">
          <RecentTasks className="flex-1 min-h-0" />
          <HomeSideBar className="hidden lg:flex flex-col w-80" />
        </div>
      </SortProvider>
    )}

    <Outlet />
  </div>
);

}

export default Home;
