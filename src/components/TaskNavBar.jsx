import React, { useEffect, useState } from 'react';
import { IconAction } from './Icon';
import { Link } from 'react-router-dom';
import { useProjectContext } from '../context/ProjectContext';
import { useFetchActiveProjectData } from '../services/FetchData';
import { BarLoader } from 'react-spinners';


function TaskNavBar() {
  const { fetchID } = useProjectContext();
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true)
  const [projectData, setProjectData] = useState([]);
  const activeLocalProjectID = localStorage.getItem('activeProjectId');

  useEffect(() => {
    const fetchProjectID = async () => {
      try {
        const projectID = await fetchID();
        console.log("Fetched Project ID:", projectID);
        setId(projectID);
      } catch (error) {
        console.error('Error fetching project id: ', error);
      }
    };

    if (!activeLocalProjectID) {
      fetchProjectID;
    } else {
      setId(activeLocalProjectID);
      setLoading(false);
      console.log('Local storage project is used');
    };

  }, [fetchID, activeLocalProjectID]);

  useFetchActiveProjectData(id, setProjectData, setLoading)

  return (
    <div className='bg-white flex items-center justify-center w-full h-auto shadow-sm'>
      <div className='flex max-w-screen-2xl w-full py-2 px-4 justify-between items-center sticky top-0'>
        <span className='flex gap-2 items-center'>
          <Link to='/'>
            <IconAction 
              dataFeather='arrow-left' 
              className='h-[2.5rem] w-[2.5rem] border-none justify-center' 
              style={{ width: '1.5rem', height: '1.5rem', strokeWidth: '3' }}
            />
          </Link>
          {loading ? (
            <BarLoader color='#228B22' size={10} />
          ) : (
            <span className='flex flex-col'>
              <h1 className='text-lg font-bold mb-1 text-green-700'>{projectData.title}</h1>
              <p className="text-xs text-gray-600 font-semibold">{projectData.date}</p>
            </span>
          )}
        </span>
        <span className='flex items-center gap-4'>
          <span id="task-user" className='flex gap-1'>
            
          </span>
          <IconAction dataFeather='plus' />
        </span>
      </div>
    </div>
  );
}

export default TaskNavBar;
