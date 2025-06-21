import React, { useState, useEffect } from 'react';
import { DisplayTitleSection } from './TitleSection';
import { useFetchTaskData } from '../services/FetchData';
import { useReloadContext } from '../context/ReloadContext';
import { BarLoader } from 'react-spinners';
import { TaskCard } from './Cards';
import { where } from 'firebase/firestore';
import { useAuth } from './hooks/useAuth';

function AssignedTasks({}) {
  const { key } = useReloadContext();
  const user = useAuth();
  const [customWhere, setCustomWhere] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      setCustomWhere([
        where("team-uids", "array-contains", user.uid),
        where("status", "==", "To-do")
      ]);
    }
  }, [user?.uid]);
  

  const { taskData, loading } = useFetchTaskData(customWhere, key);

  return (
    <div className="flex flex-col bg-white p-4 rounded-md w-full h-[calc(100vh-3.5rem)] shadow-sm overflow-y-auto">
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
                key={taskData.id}
                title={taskData.title}
                description={taskData.description}
                deadline={taskData.deadline}
                team={taskData.team}
                status={taskData.status}
                id={taskData.id}
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
