import React, { useState } from 'react';
import Icon from '../Icon';
import { IconTitleSection } from '../TitleSection';
import deleteData from '../../services/DeleteData';
import { useReloadContext } from '../../context/ReloadContext';


function Popup({ title, closeModal, id, collectionName}) {

  const { reloadComponent } = useReloadContext();

  const handleDelete = async () => {
    await deleteData(id, collectionName, reloadComponent);
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col p-4 bg-white rounded-2xl gap-1 w-[15rem] h-auto">
        <IconTitleSection title={title} iconOnClick={closeModal} className='items-center' dataFeather='x' />
        <section className="flex items-center border border-green-700 border-opacity-25 p-2 gap-2 rounded-xl w-full hover:bg-green-100 cursor-pointer" onClick={handleDelete}>
          <Icon dataFeather='trash' />
          <p>Delete</p>
        </section>
      </div>
    </div>
  );
}

export default Popup;
