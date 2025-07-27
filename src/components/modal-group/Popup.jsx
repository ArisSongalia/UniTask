
import { IconTitleSection } from '../TitleSection';
import deleteData from '../../services/DeleteData';
import { useReloadContext } from '../../context/ReloadContext';
import Button, { ButtonIcon } from '../Button';
import { useMoveStatus } from '../../services/useMoveStatus';
import { useState } from 'react';
import { CreateProject, CreateTask } from './Modal';


function Popup({ closeModal, className = '',  collectionName, taskData, projectData }) {
  const { reloadComponent } = useReloadContext();
  const [showUpdateInfo, setShowUpdateInfo] = useState(false);
  const moveStatus = useMoveStatus();

  const handleMoveStatus = async () => {
    await moveStatus({ name: collectionName, id: taskData?.id || projectData?.id, team: taskData?.team || 1}); 
    closeModal();
  };

  const handleDelete = async () => {
    await deleteData({id: taskData?.id || projectData?.id, collectionName: collectionName, reloadComponent: reloadComponent});
    closeModal();
  };

  const handleShowUpdateInfo = () => {
    setShowUpdateInfo(!showUpdateInfo);
  }

  return (
      <div
        className={`flex flex-col absolute z-50 top-0 right-0 gap-0 p-4 bg-white border rounded-md w-[10rem] h-auto cursor-default shadow-md${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <IconTitleSection title={taskData?.title || projectData?.title} iconOnClick={closeModal} className="items-center" dataFeather="x" />
        <ButtonIcon 
          text="Move Status" 
          dataFeather="flag" 
          className='border-none bg-white'
          onClick={handleMoveStatus} 
        />
        <ButtonIcon 
          text="Edit" 
          className='border-none bg-white'
          dataFeather="edit"
          onClick={handleShowUpdateInfo}
        />
        {showUpdateInfo && (
          taskData? (
            <CreateTask taskData={taskData} closeModal={closeModal} />
          ) : projectData? (
            <CreateProject projectData={projectData} closeModal={closeModal} />
          ) : null
        )
        }

        <ButtonIcon 
          text="Delete" 
          dataFeather="trash"
          className='border-none bg-white'
          onClick={handleDelete} 
         />
      </div>
  );
}

export default Popup;
