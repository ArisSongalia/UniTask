import React, { useState, useEffect } from 'react';
import TitleSection, { IconTitleSection } from './TitleSection';
import { UserCard } from './Cards';
import { useFetchActiveProjectData } from '../services/FetchData';
import { useReloadContext } from '../context/ReloadContext';
import { BarLoader } from 'react-spinners';
import { IconUser } from './Icon';

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

  const handleSetSingleActiveUser = (data) => {
    setActiveUser(data);
  }
 

  useFetchActiveProjectData(id, setProjectData, setLoading, key);

  return (
    <div
      className={`flex z-50 absolute top-20 shadow-md right-4 flex-col p-4 rounded-md w-full max-w-[40rem] h-[30rem] overflow-hidden bg-white ${className}`}
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
            <BarLoader color='green' />
          ) : projectData['team'] ? (
            projectData['team'].map((member) => (
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
          
          ))) : (
            <p className='text-slate-700 text-sm'>No active members available</p>
          )
          }
        </section>

        <section
          id="main-message"
          className="bg-gray-50 rounded-lg w-full h-full overflow-y-auto"
        ></section>
      </section>
    </div>
  );
}

export default SocialSection;
