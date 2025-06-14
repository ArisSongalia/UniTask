import React, { useState } from 'react';
import { DisplayTitleSection } from './TitleSection';
import { useFetchTaskData } from '../services/FetchData';
import { useReloadContext } from '../context/ReloadContext';
import { BarLoader } from 'react-spinners';
import { TaskCard } from './Cards';

function AssignedTasks({}) {
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { key } = useReloadContext();


  useFetchTaskData(setTaskData, setLoading, key);
  
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
