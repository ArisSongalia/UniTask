import React, { useEffect, useState } from 'react';
import { IconAction, IconUser } from './Icon';
import { Link } from 'react-router-dom';
import { useFetchActiveProjectData } from '../services/FetchData';
import { BounceLoader, BarLoader } from 'react-spinners';
import { AddMembers } from './modal-group/Modal';
import SocialSection from './SocialSection';
import { useReloadContext } from '../context/ReloadContext';
import TaskSideBar from './TaskSideBar';


function TaskNavBar() {
  const { key } = useReloadContext();

  const [visibility, setVisbility] =  useState({
    addMembers: false,
    socialSection: false,
    taskSideBar: false,
  });

  const toggleVisbility = (section) => {
    setVisbility((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  };

  const { projectData, loading } = useFetchActiveProjectData(key);

  return (
    <div className='bg-white flex z-50 items-center py-2 px-4 justify-center sticky top-0 w-full h-fit shadow-sm'>
      <div className='flex max-w-screen-2xl w-full justify-between items-center sticky top-0'>
        <span className='flex gap-2 items-center'>
            <IconAction 
              dataFeather='arrow-left' 
              className='h-[2.5rem] w-[2.5rem] border-none justify-center' 
              style={{ width: '1.5rem', height: '1.5rem', strokeWidth: '3' }}
              iconOnClick={() => {
                localStorage.removeItem('activeProjectId'),
                window.history.back()
              }}
            />
          {loading ? (
            <BarLoader color='#228B22' size={10} />
          ) : (
            <span className='flex flex-col text-gray-700'>
              <h1 className='text-lg font-bold mb-1 '>{projectData.title}</h1>
              <span className='flex gap-1'>
                <p className="text-xs font-semibold">{projectData.type}</p>
                <span className="h-4 border-l border-gray-400"></span>
                <p className="text-xs font-semibold">{projectData.date}</p>
              </span>
            </span>
          )}
        </span>
        <span className='flex items-center gap-1'>
          { projectData.type === 'Shared' ? (
            <>
              <IconAction dataFeather='user-plus' iconOnClick={() => toggleVisbility('addMembers')} />
              {visibility.addMembers && <AddMembers closeModal={() => toggleVisbility('addMembers')} />}
            </>
          ) : (null)}

          <IconAction dataFeather='message-square' iconOnClick={() => toggleVisbility('socialSection')} />
          {visibility.socialSection && <SocialSection closeModal={() => toggleVisbility('socialSection')} />}

          <IconAction dataFeather='plus' className='lg:hidden' iconOnClick={() => toggleVisbility('taskSideBar')} />
          {visibility.taskSideBar && 
            <TaskSideBar 
              closeModal={() => toggleVisbility('taskSideBar')}
              className='fixed top-0 left-0 w-full min-h-screen max-w-[100vw] z-40 bg-white lg:hidden'
             />
          }

            <span id="user" className='flex gap-1 p-1 rounded-full bg-blue-50'>
              {loading ? (
                <BounceLoader color='#228B22' size={25} />
              ) : projectData['team'] && (
                projectData['team'].map((member) => (
                  <IconUser key={member.uid} user={member} />
                ))
              )}
            </span>
        </span>
      </div>
    </div>
  );
}

export default TaskNavBar;
