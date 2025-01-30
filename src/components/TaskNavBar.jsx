import React, { useEffect, useState } from 'react';
import { IconAction, IconUser } from './Icon';
import { Link } from 'react-router-dom';
import { useProjectContext } from '../context/ProjectContext';
import { useFetchActiveProjectData } from '../services/FetchData';
import { BounceLoader, BarLoader } from 'react-spinners';
import { AddMembers } from './modal-group/Modal';
import { ButtonIcon} from './Button';
import SocialSection from './SocialSection';


function TaskNavBar() {
  const { fetchID } = useProjectContext();
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true)
  const [projectData, setProjectData] = useState([]);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [showSocialSection, setShowSocialSection] = useState(false);
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

  const toggleShowAddMembers = () => {
    setShowAddMembers(!showAddMembers);
  };

  const toggleShowSocialSection = () => {
    setShowSocialSection(!showSocialSection);
  }


  useFetchActiveProjectData(id, setProjectData, setLoading)

  return (
    <div className='bg-white flex z-50 items-center justify-center sticky top-0 w-full h-fit shadow-sm'>
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
          <span id="task-user" className='flex gap-1 p-2 rounded-full bg-gray-100'>
            {loading ? (
              <BounceLoader color='#228B22' size={25} />
            ) : projectData['team'] && (
              projectData['team'].map((member) => (
                <IconUser key={member.uid} username={member.username} uid={member.uid} />
              ))
            )}
          </span>
          <ButtonIcon text='Add Members' dataFeather='user-plus' onClick={toggleShowAddMembers}/>
          {showAddMembers && <AddMembers closeModal={toggleShowAddMembers}/>}
          <IconAction dataFeather='message-square' iconOnClick={toggleShowSocialSection} />
          {showSocialSection && <SocialSection/>}
        </span>
      </div>
    </div>
  );
}

export default TaskNavBar;
