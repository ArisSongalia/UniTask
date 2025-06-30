import React, { useState, useEffect, useReducer } from 'react';
import { IconTitleSection } from './TitleSection';
import { EveryOneCard, UserCard } from './Cards';
import { useFetchActiveProjectData } from '../services/FetchData';
import { useReloadContext } from '../context/ReloadContext';
import { BarLoader } from 'react-spinners';
import { IconAction } from './Icon';


function reducer(state, action) {
  switch (action.type) {
    case 'SET_ACTIVE_USER':
      return { ...state, activeUser: action.payload };
    default:
      return state;
  }
}

function SocialSection({ className = '', closeModal = () => {} }) {
  const { key } = useReloadContext();
  const projectId = localStorage.getItem('activeProjectId');

  const { projectData, loading } = useFetchActiveProjectData(projectId, key);

  const initialState = {
    activeUser: null,
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const { activeUser } = state;

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
        <section id="user-chat-heads" className="flex flex-col min-w-fit h-full w-[16rem]">
          {loading ? (
            <BarLoader color="green" />
          ) : projectData?.team ? (
            <>
              <EveryOneCard
                projectData={projectData}
                isActive={activeUser?.tag === 'everyone'}
                onStateChange={(data) => {
                  dispatch({ type: 'SET_ACTIVE_USER', payload: data.isActive ? data : null });
                }}
              />

              {projectData.team.map((member) => (
                <UserCard
                  key={member.uid}
                  user={member}
                  withEmail={false}
                  isActive={activeUser?.uid === member.uid}
                  onStateChange={(data) => {
                    dispatch({ type: 'SET_ACTIVE_USER', payload: data.isActive ? data : null });
                  }}
                />
              ))}
            </>
          ) : (
            <p className="text-slate-700 text-sm">No active members available</p>
          )}
        </section>

        <section
          id="chat-window"
          className="flex flex-col bg-gray-50 rounded-lg w-full h-full justify-end overflow-y-auto p-2"
        >
          {activeUser ? (
            <IconTitleSection
              title={activeUser?.username ?? activeUser?.memberNames?.join(', ')}
              dataFeather="more-vertical"
              className="bg-slate-50 rounded-full"
            />
          ) : (
            <span className="text-gray-600">Select a user to chat with</span>
          )}

          <section id="messageDisplay" className="flex h-full w-full"></section>

          <section
            id="messageInput"
            className="flex h-12 w-full border-2 border-green-700 border-opacity-40 rounded-full self-end items-center gap-1 p-1"
          >
            <input className="border border-gray-300 rounded-full px-3 w-full h-full focus:ring-1 focus:ring-green-600 focus:outline-none hover:cursor-pointer" />
            <IconAction className="justify-end" dataFeather="send" />
          </section>
        </section>
      </section>
    </div>
  );
}

export default SocialSection;
  