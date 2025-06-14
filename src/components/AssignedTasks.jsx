import React, { useState, useEffect } from 'react';
import { DisplayTitleSection } from './TitleSection';
import { useFetchTaskData } from '../services/FetchData';
import { useReloadContext } from '../context/ReloadContext';
import { BarLoader } from 'react-spinners';
import { TaskCard } from './Cards';
import { auth } from '../config/firebase';
import { where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

function AssignedTasks({}) {
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { key } = useReloadContext();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const customWhere = user ? where("task-team", "array-contains", user.uid) : null;
  useFetchTaskData(setTaskData, setLoading, key, customWhere);
  
  return (
    <div className="flex flex-col bg-white p-4 rounded-md w-full max-h-full h-full shadow-sm overflow-hidden">
      <DisplayTitleSection
        title="Assigned Tasks"
        displayCount={taskData.length}
      />
      <section className="flex flex-col gap-2 w-full h-full pr-2 overflow-y-auto">
        {loading ? (
          <span><BarLoader color='#228B22' size={20} /></span>
        ) : (
          taskData.length > 0 && (
            taskData.map((taskData) => (
              <TaskCard 
                key={taskData['task-id']}
                title={taskData['task-title']}
                description={taskData['task-description']}
                deadline={taskData['task-deadline']}
                team={taskData['task-team']}
                status={taskData['task-status']}
                id={taskData['task-id']}
                className='h-fit hover:cursor-pointer'
              />
            ))
          )
        )}
      </section>
    </div>
  );
}

export default AssignedTasks;
