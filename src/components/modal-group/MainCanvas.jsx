import React from 'react';
import { IconTitleSection } from '../TitleSection';

function MainCanvas({closeModal}) {
  return (
    <backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={closeModal}>
      <div className='flex flex-col p-4 bg-white rounded-md h-[90vh] max-w-screen-xl w-full'>
        <IconTitleSection title='Canvas' iconOnClick={closeModal} dataFeather='x'/>
        <canvas className='bg-green-50 h-full w-full rounded-md'>

        </canvas>
      </div>
    </backdrop>
  )
}

export default MainCanvas