import { useState } from 'react';
import { useReloadContext } from '../../context/ReloadContext';
import { useSort } from '../../context/SortContext';
import deleteData from '../../services/DeleteData';
import { useMoveStatus } from '../../services/useMoveStatus';
import { ButtonIcon } from '../Button';
import { IconTitleSection } from '../TitleSection';
import CreateNote from './create-modals/CreateNote';
import CreateProject from './create-modals/CreateProject';
import CreateTask from './create-modals/CreateTask';


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
          className='bg-white shadow-none'
        />
        <ButtonIcon 
          text="Edit" 
          dataFeather="edit"
          onClick={handleShowUpdateInfo}
          className='bg-white shadow-none'
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
          className='bg-white shadow-none'
         />
      </div>
  );
}

function FilterPopup({ closeModal }) {
  const { sortState, setSortState } = useSort();

  const cycle = (key) => {
    setSortState(prev => {
      const next = prev[key] === null ? "asc" : prev[key] === "asc" ? "desc" : null;
      return { title: null, date: null, progress: null, [key]: next };
    });
  };

  const icon = (v) => v === "asc" ? "arrow-up" : v === "desc" ? "arrow-down" : "minus";
  const style = (v) => v ? "bg-green-700 text-white border-green-600" : "bg-white text-green-700 border-green-600";
  const iconStyle = (v) => v ? "text-white" : "text-green-600";

  return (
    <div className="absolute z-50 top-0 right-0 bg-white border rounded-xl shadow-lg p-3 w-44" onClick={e => e.stopPropagation()}>
      <IconTitleSection iconOnClick={closeModal} title='Order By' dataFeather='x' />

      {["title", "date", "progress"].map(key => (
        <ButtonIcon
          key={key}
          onClick={() => cycle(key.toLowerCase())}
          className={`w-full flex items-center p-3 rounded-md font-medium border mb-1 ${style(sortState[key])}`}
          dataFeather={icon(sortState[key])}
          text={key.charAt(0).toUpperCase() + key.slice(1)}
          iconClassName={iconStyle(sortState[key])}
        />
      ))}
    </div>
  );
}


export default Popup;

export { FilterPopup };

