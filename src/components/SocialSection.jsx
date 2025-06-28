import React, { useState, useEffect, useReducer } from 'react';
import TitleSection, { IconTitleSection } from './TitleSection';
import { EveryOneCard, UserCard } from './Cards';
import { useFetchActiveProjectData } from '../services/FetchData';
import { useReloadContext } from '../context/ReloadContext';
import { BarLoader } from 'react-spinners';
import { IconAction, IconUser } from './Icon';

function SocialSection({ className = '', closeModal = () => {} }) {
  const [projectData, setProjectData] = useState({});
  const [loading, setLoading] = useState(false);
  const { key } = useReloadContext();
  const [id, setID] = useState();
  const [activeUser, setActiveUser] = useState();
  const activeProjectId = localStorage.getItem('activeProjectId');
  

  useEffect(() => {
    if (activeProjectId) {
      setID(activeProjectId);
    }
  }, [activeProjectId, key]);
 
  useFetchActiveProjectData(id, setProjectData, setLoading, key);

  return (
    <div
      className={`flex z-50 absolute top-20 shadow-md right-4 flex-col p-4 rounded-md w-full max-w-[40rem] h-[35rem] overflow-hidden bg-white ${className}`}
    >
      <IconTitleSection
        title="Socials"
        buttonText="New Chat"
        dataFeather="x"
        iconOnClick={closeModal}
      />

      <section className="flex gap-2 h-full">
        <section id="user-chat-heads" className=" flex flex-col min-w-fit h-full w-[16rem]">
          {loading ? (
            <BarLoader color="green" />
          ) : projectData['team'] ? (
            <>
              <EveryOneCard
                projectData={projectData}
                isActive={activeUser?.tag === 'everyone'}
                onStateChange={(data) => {
                  if (data.isActive) {
                    setActiveUser(data);
                  } else {
                    setActiveUser(null);
                  }
                }}
              />

              {projectData.team.map((member) => (
                <UserCard
                  key={member.uid}
                  user={member}
                  withEmail={false}
                  isActive={activeUser?.uid === member.uid}
                  onStateChange={(data) => {
                    if (data.isActive) {
                      setActiveUser(data);
                    } else {
                      setActiveUser(null);
                    }
                  }}
                />
              ))}
            </>
          ) : (
            <p className="text-slate-700 text-sm">No active members available</p>
          )}
        </section>

        <section
          id="main-message"
          className="flex flex-col bg-gray-50 rounded-lg w-full h-full justify-end overflow-y-auto p-2"
        >
        {activeUser ? (
          <IconTitleSection 
            title={activeUser?.username ?? activeUser?.memberNames?.join(', ')} 
            dataFeather='more-vertical'
            className='bg-slate-50 rounded-full'
          />
        ) : (
          <span className='text-gray-600'>Select a user to chat with</span>
        )}  

        <section id='messageDisplay' className='flex h-full w-full'>

        </section>

        <section id='messageInput' className='flex h-12 w-full border-2 border-green-700 border-opacity-40 rounded-full self-end items-center gap-1 p-1'>
          <input className="border border-gray-300 rounded-full px-3 w-full h-full focus:ring-1 focus:ring-green-600 focus:outline-none hover:cursor-pointer" />
          <IconAction className='justify-end' dataFeather='send'/>
        </section>
        </section>
      </section>
    </div>
  );
}

export default SocialSection;
  