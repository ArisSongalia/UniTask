
import { IconTitleSection } from '../TitleSection';
import deleteData from '../../services/DeleteData';
import { useReloadContext } from '../../context/ReloadContext';
import Button, { ButtonIcon } from '../Button';
import { useMoveStatus } from '../../services/useMoveStatus';
import { useState } from 'react';
import { CreateNote, CreateProject, CreateTask } from './Modal';
import Icon from '../Icon';


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

function FilterPopup({ closeModal }) {
  const [sortState, setSortState] = useState({
    name: null,
    date: null,
    progress: null,
  });

  const handleChangeIcon = (key) => {
    setSortState(prev => {
      const current = prev[key];
      let next =
        current === null ? "asc" :
        current === "asc" ? "desc" :
        null;

      return {
        name: null,
        date: null,
        progress: null,
        [key]: next,
      };
    });
  };

  const getIcon = (value) =>
    value === "asc" ? "arrow-up" :
    value === "desc" ? "arrow-down" :
    "minus";

  const getClass = (value) =>
    value === "asc" ? "bg-green-200" :
    value === "desc" ? "bg-blue-200" :
    "bg-gray-100";

  return (
    <div
      className="bg-white p-4 flex flex-col absolute z-50 top-0 right-0 shadow-md"
      onClick={(e) => e.stopPropagation()}
    >
      <IconTitleSection
        title="Filter"
        iconOnClick={closeModal}
        dataFeather="x"
      />

      <div className="flex flex-col flex-1 gap-1">
        {["name", "date", "progress"].map(key => (
          <ButtonIcon
            key={key}
            text={key.charAt(0).toUpperCase() + key.slice(1)}
            dataFeather={getIcon(sortState[key])}
            className={getClass(sortState[key])}
            onClick={() => handleChangeIcon(key)}
          />
        ))}
      </div>
    </div>
  );
}


export default Popup;

export { FilterPopup };
