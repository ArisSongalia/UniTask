import React, { useEffect, useState } from 'react';
import feather from 'feather-icons';
import { UserProfile } from './modal-group/Modal';
import defaultUserIcon from '../assets/default-icon.png'
 
function IconAction({ className = '', dataFeather = 'edit-2', actionText= '', style = {}, iconOnClick, text = ""}) {
  useEffect(() => {
    feather.replace();
  }, [dataFeather]);

  return (
    <section 
      className={`flex rounded-full p-[6px] gap-2 items-center justify-center text-green-900
        w-fit h-fit cursor-pointer bg-green-50 border border-opacity-50
        hover:bg-green-700 hover:text-white
        active:bg-green-700 focus:bg-green-50 focus:outline-none
        ${className}`}
      style={{ touchAction: 'manipulation' }}
      aria-hidden="true" 
      aria-label={actionText}
      onClick={(e) => {
        e.stopPropagation(),
        iconOnClick()
      }}
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

function IconUser({ user={}, className=''}) {
  const [showUserProfile, setShowUserProfile] = useState(false);

  const handleShowUserProfile = () => {
    setShowUserProfile(!showUserProfile);
  };

  return (
    <div className={`hover:cursor-pointer border rounded-full h-7 w-7 hover:border-green-500  ${className}`}>
        <img src={user.photoURL} alt={defaultUserIcon} className='h-full w-full rounded-full' onClick={handleShowUserProfile}/>
        {showUserProfile && <UserProfile user={user} closeModal={handleShowUserProfile}/>}
    </div>

  )
}

export default Icon;
export { IconAction, IconUser };

