
import { IconTitleSection } from '../TitleSection';
import deleteData from '../../services/DeleteData';
import { useReloadContext } from '../../context/ReloadContext';
import Button, { ButtonIcon } from '../Button';
import { useMoveStatus } from '../../services/useMoveStatus';
import { useState } from 'react';
import { CreateNote, CreateProject, CreateTask } from './Modal';


function Popup({ closeModal, className = '',  collectionName, taskData, projectData, noteData }) {
  const { reloadComponent } = useReloadContext();
  const [showUpdateInfo, setShowUpdateInfo] = useState(false);
  const moveStatus = useMoveStatus();

  const handleMoveStatus = async () => {
    await moveStatus({ name: collectionName, id: taskData?.id || projectData?.id  || noteData.id, team: taskData?.team || 1}); 
    closeModal();
  };

  const handleDelete = async () => {
    await deleteData({id: taskData?.id || projectData?.id || noteData.id, collectionName: collectionName, reloadComponent: reloadComponent});
    closeModal();
  };

  const handleShowUpdateInfo = () => {
    setShowUpdateInfo(!showUpdateInfo);
  }

  return (
      <div
        className={`flex flex-col absolute z-50 top-0 right-0 p-4 bg-white border rounded-md w-[12rem] h-auto cursor-default shadow-md${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <IconTitleSection title={taskData?.title || projectData?.title || noteData?.title} iconOnClick={closeModal} dataFeather="x" />
        <ButtonIcon 
          text="Move Status" 
          dataFeather="flag" 
          onClick={handleMoveStatus} 
          className='bg-white'
        />
        <ButtonIcon 
          text="Edit" 
          dataFeather="edit"
          onClick={handleShowUpdateInfo}
          className='bg-white'
        />
        {showUpdateInfo && (
          taskData? (
            <CreateTask taskData={taskData} closeModal={closeModal} />
          ) : projectData? (
            <CreateProject projectData={projectData} closeModal={closeModal} />
          ) : noteData? (
            <CreateNote noteData={noteData} closeModal={closeModal} />
          ) : null
        )
        }

        <ButtonIcon 
          text="Delete" 
          dataFeather="trash"
          onClick={handleDelete} 
          className='bg-white'
         />
      </div>
  );
}

export default Popup;
