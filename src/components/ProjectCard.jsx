import { IconAction } from './Icon';
import { Link } from 'react-router-dom';
import Button from './Button';
import React, { useState } from 'react';
import { CreateProject } from './modal-group/Modal';


function ProjectCard({ 
  title = 'Project Name', 
  description = 'Example text should go here',
  date = '00/00/00',
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

function CreateProjectCard({onClick}) {
  const [showPopUp, setShowPopUp] = useState(false);

  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  }
  
  return (
    <div
      className="flex flex-col bg-white rounded-xl overflow-hidden hover:cursor-pointer hover:border-opacity-100
      flex-grow justify-between border-2 gap-4 border-green-600 border-opacity-50 p-4 h-[15rem]"
      onClick={onClick}
    >
      <span className="flex flex-col justify-between gap-4 w-full items-center">
        <span className='self-start justify-start gap-2 flex flex-col'>
        <h2 className='font-semibold text-md'>Create Project</h2>
        <p className='text-sm'>Get started! Manage tasks individually or collaboratively.</p>
        </span>
        {showPopUp && <CreateProject closeModal={togglePopUp}/>}
      </span>
    </div>
  );
}

export default ProjectCard;
export {CreateProjectCard};
