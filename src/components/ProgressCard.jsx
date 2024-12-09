import React, {useState} from 'react'
import { IconAction } from './Icon'
import { Link } from 'react-router-dom';
import Button from './Button'
import Popup from './modal-group/Popup';

function ProgressCard({title = 'Task Title'}) {
  const [isClicked, setIsClicked] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);

  const toggleClick = () => {
    setIsClicked(!isClicked);
  };

  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById('file-input');
    fileInput.click();
  };

  return (
    <div className="flex flex-col bg-white rounded-xl h-auto border-opacity-50
                      w-full justify-between border gap-2 border-green-700 p-4">
      <span className='flex justify-between'>
        <span>
          <h2 className="font-bold mb-2">{title}</h2>
          <p className="text-xs font-semibold text-gray-500">30/10/2024</p>
        </span>
        <IconAction dataFeather='more-vertical' className='' iconOnClick={togglePopUp}/>
        {showPopUp && <Popup title={title} closeModal={togglePopUp}/>}
      </span>

      <p className="text-sm">Lorem ipsum dolor sit amet. Example text should go here</p>

      <span id="task-user" className='flex gap-1'>
        <IconAction dataFeather='user'/>
        <IconAction dataFeather='user'/>
        <IconAction dataFeather='user'/>
      </span>

      <span className="flex w-full gap-1">
        <Button 
          text='Upload File' 
          className='w-full' 
          onClick={triggerFileInput}
        />
        <input id='file-input' type="file" className='hidden' />
        <Button 
          text='Mark Finish' 
          className={`${isClicked ? 'bg-green-700 text-white w-full' : 'w-full'}`}
          onClick={toggleClick}
        />
      </span>
    </div>
  )
}

function ProgressAlertCard({title = 'Task Title', description = 'Lorem ipsum dolor sit amet. Example text should go here Lorem ipsum dolor sit amet.'}) {
  const [showPopUp, setShowPopUp] = useState(false);
  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  };

  return (
    <div className="flex flex-col bg-white rounded-xl h-auto border-opacity-50
                      w-full justify-between border gap-2 border-green-700 p-4">
      <span className='flex justify-between'>
        <span>
          <h2 className="font-bold mb-2">{title}</h2>
          <p className="text-xs font-semibold text-gray-500">30/10/2024</p>
        </span>
        <IconAction dataFeather='more-vertical' className='' iconOnClick={togglePopUp}/>
        {showPopUp && <Popup title={title} closeModal={togglePopUp}/>}
      </span>

      <p className="text-sm my-2">
        {description}
      </p>

      <span className="flex w-full gap-1">
        <Link to={"../TaskMain"} className='w-full'>
          <Button 
            text='Open Task' 
            className='w-full' 
          />
        </Link>
      </span>
    </div>
  )
}

export default ProgressCard
export {ProgressAlertCard}