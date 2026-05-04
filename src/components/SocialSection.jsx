import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useReducer, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { auth, db } from '../config/firebase';
import { useReloadContext } from '../context/ReloadContext';
import { useFetchActiveProjectData, useFetchMessageData } from '../services/FetchData';
import { createNotification } from '../services/notifications';
import { EveryOneCard, UserCard } from './Cards';
import { IconAction, IconUser } from './Icon';
import { IconTitleSection } from './TitleSection';


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
  const { projectId } = useParams();
  const initialState = {
    activeUser: null,
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const { activeUser } = state;
  const [isSending, setIsSending] = useState(false);

  const { projectData, loading: projectLoading } = useFetchActiveProjectData(projectId, key);
  const messageRef = useRef(null);  
  const activeProjectId = projectData?.id || projectId;
  
  // Check if user is in the project
  const isUserInProject = projectData?.team?.some(member => member.uid === auth.currentUser?.uid);
  
  // Only fetch messages if user is in the project
  const { sentMessageData, receivedMessageData, loading: messageLoading } = useFetchMessageData(
    isUserInProject ? activeUser : null, 
    activeProjectId
  );

  const handleSendMessage = async () => {
    const messageText = messageRef.current.value.trim();
    if (messageText === '') return; 

    if (!messageRef.current || !messageRef.current.value || !activeUser) {
      console.log('No active user or input')
      return
    }

    // Ensure user is still in project
    if (!isUserInProject) {
      console.log('User is not in this project')
      return;
    }

    try{
      setIsSending(true);
      // Save to project-specific messages subcollection
      await addDoc(collection(db, 'projects', activeProjectId, 'messages'), {
        senderId: auth.currentUser.uid,
        text: messageText,
        timestamp: serverTimestamp(),
        type: 'text',
        readBy: [],
        // Use uid for direct messages, or 'everyone' for group messages
        messageTo: activeUser.uid ?? (activeUser.tag === 'everyone' ? 'everyone' : activeUser.uid),
        projectId: activeProjectId,
      })

      if (activeUser?.uid && activeUser.uid !== auth.currentUser.uid) {
        await createNotification({
          uid: activeUser.uid,
          title: 'New message',
          message: messageText,
          type: 'direct_message',
          projectId: activeProjectId,
        });
      }
    } catch(error) {
        console.log('Error sending message: ', error)
    } finally {
        messageRef.current.value = "";
        setIsSending(false);
    }
  }

  const handleMessageKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!isSending) {
        handleSendMessage();
      }
    }
  };

  return (
    <div
      className={`flex z-50 absolute top-[3.7rem] shadow-lg right-0 flex-col p-4 rounded-lg w-full max-w-[44rem] h-[36rem] overflow-hidden bg-white border border-gray-100 ${className}`}
    >
      <IconTitleSection
        title="Socials"
        buttonText="New Chat"
        dataFeather="x"
        iconOnClick={closeModal}
      />

      <section className="flex gap-3 h-full">
        <section id="user-chat-heads" className="flex flex-col min-w-fit h-full w-[16rem] border-r border-gray-100 pr-2">
          {projectLoading ? (
            <BarLoader color="green" />
          ) : !isUserInProject ? (
            <p className="text-slate-700 text-sm">You are not a member of this project</p>
          ) : projectData?.team ? (
            <>
              <EveryOneCard
                projectData={projectData}
                isActive={activeUser?.displayname === 'everyone'}
                onStateChange={(data) => {
                  dispatch({ type: 'SET_ACTIVE_USER', payload: data.isActive ? data : null });
                }}
              />

              {projectData.team
              .filter(member => member.uid !== auth.currentUser.uid)
              .map((member) => (
                <UserCard
                  key={member.uid}
                  user={member}
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
          className="flex flex-col bg-gray-50 rounded-lg w-full h-full overflow-hidden"
        >
          {messageLoading ? (
            <div className="flex items-center justify-center h-full">
              <BarLoader color="green" />
            </div>
          ) : !isUserInProject ? (
            <span className="text-gray-600">You don't have access to this project's chat</span>
          ) : activeUser ? (
            <div className='flex flex-col h-full'>
              <div className='flex items-center justify-between border-b border-gray-100 px-3 py-2 bg-white'>
                <IconTitleSection
                  title={activeUser?.username ?? activeUser?.memberNames?.join(', ') ?? 'Everyone'}
                  dataFeather="more-vertical"
                  className="gap-2"
                  titleClassName='text-sm'
                />
              </div>

              <div
                id="messageDisplay"
                className="flex flex-col h-full w-full gap-3 overflow-y-auto p-3"
              >
                {[
                  ...sentMessageData.map(msg => ({
                    ...msg,
                    isOwn: true,
                  })),
                  ...receivedMessageData.map(msg => ({
                    ...msg,
                    isOwn: false,
                  })),
                ]
                  .sort(
                    (a, b) =>
                      (a.timestamp?.seconds || 0) -
                      (b.timestamp?.seconds || 0)
                  )
                  .map((message) => {
                    const sender =
                      projectData?.team?.find(
                        member => member.uid === message.senderId
                      ) || {};

                    const timestamp = message.timestamp?.toDate
                      ? message.timestamp.toDate().toLocaleString()
                      : '';

                    return (
                      <section
                        key={message.id}
                        className={`flex flex-col ${
                          message.isOwn ? 'items-end' : 'items-start'
                        }`}
                      >
                        {/* Sender Info */}
                        <div className="flex items-center gap-2 mb-1">
                          {!message.isOwn && (
                            <IconUser user={sender} />
                          )}

                          <span className="flex flex-col">
                            <span className="text-xs font-semibold text-gray-700">
                              {message.isOwn
                                ? ''
                                : sender.displayName ||
                                  sender.username ||
                                  'Unknown User'}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {timestamp}
                            </span>
                          </span>
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={`px-3 py-2 text-sm rounded-2xl font-medium max-w-[70%] ${
                            message.isOwn
                              ? 'bg-green-100 text-green-900'
                              : 'bg-white text-gray-800 border border-gray-100'
                          }`}
                        >
                          {message.text}
                        </div>
                      </section>
                    );
                  })}
              </div>
              
              <label
                htmlFor='messageInput'
                className="flex h-12 w-full border-t border-gray-200 bg-white items-center px-1"
                >
                <input
                  ref={messageRef}
                  id='messageInput'
                  className="px-2 w-full h-full focus:ring-0 border border-gray-300  text-sm"
                  placeholder="Type a message..."
                  disabled={isSending}
                  onKeyDown={handleMessageKeyDown}
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={isSending}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-green-800 bg-green-50 rounded-md hover:bg-green-100 disabled:opacity-60"
                >
                  {isSending ? <BarLoader color="green" height={4} width={24} /> : "Send"}
                </button>
              </label>
            </div>
          ) : (
            <span className="text-gray-600">Select a user to chat with</span>
          )}

        </section>
      </section>
    </div>
  );
}

export default SocialSection;