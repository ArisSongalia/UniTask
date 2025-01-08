import React, { useEffect, useState } from 'react';
import { IconAction } from './Icon';
import { Link } from 'react-router-dom';
import { useProjectContext } from './ProjectContext';
import { useFetchActiveProjectData } from './FetchData';


function TaskNavBar() {
  const { fetchID } = useProjectContext();
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true)
  const [projectData, setProjectData] = useState([]);

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

    fetchProjectID();

  }, [fetchID]);

  useFetchActiveProjectData(id, setProjectData, setLoading)

  if (loading) {
    return <span>Fetching Data...</span>
  }

  return (
    <div className='bg-white flex items-center justify-center w-full h-auto shadow-sm'>
      <div className='flex max-w-screen-2xl w-full py-4 justify-between items-center'>
        <span className='flex gap-2 items-center'>
          <Link to='/'>
            <IconAction dataFeather='arrow-left' className='h-[2.4rem] w-[2.4rem] border-none' style={{ width: '2rem', height: '2rem', strokeWidth: '3' }} />
          </Link>
          <span className='flex flex-col'>
            <h1 className='text-xl font-bold mb-1 text-green-700'>{projectData.title}</h1>
            <p className="text-xs text-gray-600 font-semibold">{projectData.date}</p>
          </span>
        </span>
        <span className='flex items-center gap-4'>
          <span id="task-user" className='flex gap-1'>
            <IconAction dataFeather='user' />
            <IconAction dataFeather='user' />
            <IconAction dataFeather='user' />
          </span>
          <IconAction className='' dataFeather='plus' />
        </span>
      </div>
    </div>
  );
}

export default TaskNavBar;
