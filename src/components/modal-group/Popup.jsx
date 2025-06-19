
import { IconTitleSection } from '../TitleSection';
import deleteData from '../../services/DeleteData';
import { useReloadContext } from '../../context/ReloadContext';
import Button, { ButtonIcon } from '../Button';
import { useMoveStatus } from '../../services/useMoveStatus';


function Popup({ title, closeModal, id, collectionName }) {
  const { reloadComponent } = useReloadContext();
  const moveStatus = useMoveStatus();

  const handleMarkAsFinish = async () => {
    await moveStatus({ name: collectionName, id: id}); 
    closeModal();
  };

  const handleDelete = async () => {
    await deleteData(id, collectionName, reloadComponent);
    closeModal();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={closeModal}
    >
      <div
        className="flex flex-col p-4 bg-white rounded-2xl gap-1 w-[15rem] h-auto cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <IconTitleSection title={title} iconOnClick={closeModal} className="items-center" dataFeather="x" />
        <ButtonIcon 
          text="Move Status" 
          dataFeather="flag" 
          onClick={handleMarkAsFinish} 
        />
        <ButtonIcon 
          text="Delete" 
          dataFeather="trash"
          onClick={handleDelete} 
          className="bg-red-100 text-red-800 hover:bg-red-800"
          iconClassName='text-red-800'
         />
      </div>
    </div>
  );
}

export default Popup;
