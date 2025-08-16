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
      className={`flex rounded-full  gap-2 items-center justify-center text-green-900
        w-fit h-fit cursor-pointer shrink-0 bg-green-50 border-none
        hover:bg-green-700 hover:text-white p-[6px]
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

      {text? (
        <span className='text-xs font-semibold pr-1'>{text}</span>
      ) : (
        null
      )}
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

function IconText({ text = '', className = '', border=false }) {
  const baseColor = border ? 
  'flex flex-none text-xs h-fit bg-green-50 p-1 w-fit rounded-sm text-slate-800 font-semibold border border-green-500 rounded-sm' 
  : 'flex flex-none text-xs h-fit bg-slate-100 p-1 w-fit rounded-sm text-slate-800 font-semibold rounded-sm';

  return(
    <span className={`${baseColor} ${className}`}>
      {text}
    </span>
  )
}

export default Icon;
export { IconAction, IconUser, IconText };

