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
    <backdrop className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={closeModal}>
      <div className="flex flex-col p-4 bg-white rounded-2xl gap-1 w-[15rem] h-auto" onClick={(e) => e.stopPropagation()}>
        <IconTitleSection title={title} iconOnClick={closeModal} className='items-center' dataFeather='x' />
        <section className="flex items-center group bg-red-50 text-red-700 p-2  rounded-xl w-full hover:bg-red-700 hover:text-white cursor-pointer" onClick={handleDelete}>
          <Icon dataFeather='trash' className='text-red-700 group-hover:text-white'/>
          <p>Delete</p>
        </section>
      </div>
    </backdrop>
  );
}

export default Popup;
