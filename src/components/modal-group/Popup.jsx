
import { IconTitleSection } from '../TitleSection';
import deleteData from '../../services/DeleteData';
import { useReloadContext } from '../../context/ReloadContext';
import Button, { ButtonIcon } from '../Button';
import { useMoveStatus } from '../../services/useMoveStatus';


function Popup({ title, closeModal, id, collectionName, letMoveStatus }) {
  const { reloadComponent } = useReloadContext();
  const moveStatus = useMoveStatus();

  const handleMarkAsFinish = async () => {
    await moveStatus({ name: 'projects', id: id}); 
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
        {
          letMoveStatus === "none" ? (
            <>
              <IconTitleSection title={title} iconOnClick={closeModal} className="items-center" dataFeather="x" />
              <ButtonIcon text="Delete" dataFeather="trash" onClick={handleDelete} className="bg-red-700 text-white" />
            </>
          ) : (
            <>
              <IconTitleSection title={title} iconOnClick={closeModal} className="items-center" dataFeather="x" />
              <ButtonIcon text="Mark as Finish" dataFeather="flag" onClick={handleMarkAsFinish} className="bg-blue-600 text-white" />
              <ButtonIcon text="Delete" dataFeather="trash" onClick={handleDelete} className="bg-red-600 text-white" />
            </>
          )
        }
      </div>
    </div>
  );
}

export default Popup;
