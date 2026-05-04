import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReloadContext } from '../../context/ReloadContext';
import { useSort } from '../../context/SortContext';
import deleteData from '../../services/DeleteData';
import { useMoveStatus } from '../../services/useMoveStatus';
import { ButtonIcon } from '../Button';
import { IconTitleSection } from '../TitleSection';
import CreateNote from './create-modals/CreateNote';
import CreateProject from './create-modals/CreateProject';
import CreateTask from './create-modals/CreateTask';
import TitleSection from '../TitleSection';


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

function NotificationPopup({ notifications = [], onClear, className = ''}) {
  return (
    <div className={`bg-white flex flex-col gap-3 p-4 rounded-md shadow-md w-72 absolute top-12 right-0 z-50 border ${className}`}>
        <div className="flex items-center justify-between border-b pb-2">
        <TitleSection title="Notifications" className="mb-0" />
        {onClear && notifications.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold text-green-700 hover:text-green-800"
          >
            Mark read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-xs text-gray-500">No notifications yet.</p>
      ) : (
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {notifications.map((item) => (
            <div key={item.id} className="flex flex-col gap-0.5 bg-gray-50 rounded-md p-2">
              <p className="text-xs font-semibold text-gray-800">{item.title}</p>
              <p className="text-xs text-gray-600">{item.message}</p>
              {item.projectId && (
                <Link
                  to={`/Project/${item.projectId}`}
                  className="text-[11px] text-green-700 font-semibold mt-1"
                >
                  Open project
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


export default Popup;

export { FilterPopup, NotificationPopup };

