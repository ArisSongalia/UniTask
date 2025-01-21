import React, { useEffect, useState } from 'react';
import feather from 'feather-icons';
import userIcon from '../assets/default-icon.png';
import { UserProfile } from './modal-group/Modal';
 
function IconAction({ className = '', dataFeather = 'edit-2', actionText= '', style = {}, iconOnClick, text = ""}) {
  useEffect(() => {
    feather.replace();
  }, []);

  return (
    <section 
      className={`flex border border-opacity-50 rounded-full p-2 gap-2 items-center justify-center text-green-900
                  w-fit h-8 hover:cursor-pointer hover:bg-green-700 hover:text-white ${className}`} 
      aria-hidden="true" 
      aria-label={actionText}
      onClick={iconOnClick}
    >
      <i 
        data-feather={dataFeather} 
        style={{ width: '1rem', height: '1rem', strokeWidth: '2,5', ...style }}
        aria-hidden="true"
      ></i>

      {text}
    </section>
  );
}

function Icon({ className = '', dataFeather = 'edit-2', actionText= '', style = {} }) {
  useEffect(() => {
    feather.replace();
  }, []);

  return (
    <span 
      className={`p-2 flex items-center justify-center text-green-900 w-8 h-8 ${className}`} 
      aria-hidden="true" 
      aria-label={actionText}
    >
      <i 
        data-feather={dataFeather} 
        style={{ width: '1rem', height: '1rem', strokeWidth: '2.5', ...style }}
        aria-hidden="true"
      ></i>
    </span>
  );
}

function IconUser({ className = '', uid, username}) {
  const [showUserProfile, setShowUserProfile] = useState(false);

  const handleShowUserProfile = () => {
    setShowUserProfile(!showUserProfile);
  };

  return (
    <div className={`hover:cursor-pointer border rounded-full hover:border-green-500  ${className}`}>
        <img src={userIcon} className='h-6 w-6' onClick={handleShowUserProfile}/>
        {showUserProfile && <UserProfile username={username} uid={uid} closeModal={handleShowUserProfile}/>}
    </div>

  )
}

export default Icon;
export { IconAction, IconUser };

