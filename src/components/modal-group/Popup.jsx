
import { IconTitleSection } from '../TitleSection';
import deleteData from '../../services/DeleteData';
import { useReloadContext } from '../../context/ReloadContext';
import Button, { ButtonIcon } from '../Button';
import { useMoveStatus } from '../../services/useMoveStatus';


function Popup({ closeModal, className = '',  collectionName, data }) {
  const { reloadComponent } = useReloadContext();
  const moveStatus = useMoveStatus();

  const handleMarkAsFinish = async () => {
    await moveStatus({ name: collectionName, id: data.id, team: data.team}); 
    closeModal();
  };

  const handleDelete = async () => {
    await deleteData(data.id, collectionName, reloadComponent);
    closeModal();
  };

  return (
      <div
        className={`flex flex-col absolute z-20 top-0 right-0 p-4 bg-white border rounded-md w-[15rem] h-auto cursor-default shadow-md${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <IconTitleSection title={data.title} iconOnClick={closeModal} className="items-center" dataFeather="x" />
        <ButtonIcon 
          text="Move Status" 
          dataFeather="flag" 
          className='border-none p-1 bg-white'
          onClick={handleMarkAsFinish} 
        />
        <ButtonIcon 
          text="Delete" 
          dataFeather="trash"
          className='border-none p-1 bg-white'
          onClick={handleDelete} 
         />
        <ButtonIcon 
          text="Edit" 
          className='border-none p-1 bg-white'
          dataFeather="edit"
         />
      </div>
  );
}

export default Popup;
