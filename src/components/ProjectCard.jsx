import { IconAction } from './Icon';
import { Link } from 'react-router-dom';
import Button from './Button';
import React, { useState } from 'react';
import Popup from './Popup';

function ProjectCard({ 
  title = 'Project Name', 
  description = 'Example text should go here',
  date = '00/00/00',
  type,
}) {
  const [showPopUp, setShowPopUp] = useState(false);

  const togglePopUp = (e) => {
    e.stopPropagation(); 
    setShowPopUp(!showPopUp);
  };

  return (
    <div
      className="flex flex-col bg-white rounded-xl overflow-hidden
        flex-grow justify-between border gap-4 border-green-700 border-opacity-50 p-4 h-[15rem]"
    >
      <span className="flex justify-between gap-4">
        <span>
          <h2 className="font-bold mb-2">{title}</h2>
          <p className="text-xs font-semibold text-gray-600">{date}</p>
        </span>
        <IconAction dataFeather="more-horizontal" iconOnClick={togglePopUp} className='' />
        {showPopUp && <Popup closeModal={togglePopUp} title={title} />}
      </span>
      
      <p className="text-sm flex-grow">
        {description}
      </p>
      <Link to='TaskMain' className='w-full'>
        <Button text='Open Project' className='w-full'/>
      </Link>
    </div>
  );
}

export default ProjectCard;
