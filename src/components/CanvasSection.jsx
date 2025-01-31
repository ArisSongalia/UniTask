import React, { useState } from 'react';
import { IconTitleSection } from './TitleSection';
import { CanvasCard } from './Cards';
import { CreateCanvas } from './modal-group/Modal';

function CanvasSection() {
  const [showCreateCanvas, setShowCreateCanvas] = useState(false);

  const toggleShowCreateCanvas = () => {
    setShowCreateCanvas(!showCreateCanvas);
  }

  return (
    <div className='w-full h-full flex flex-col bg-white rounded-md p-4'>
      <IconTitleSection title='Canvas' dataFeather='plus' iconOnClick={toggleShowCreateCanvas}/>
      { showCreateCanvas && <CreateCanvas closeModal={toggleShowCreateCanvas} /> }
      
      <section className='grid grid-cols-2 gap-2'>
        <CanvasCard />
      </section>
    </div>
  )
}

export default CanvasSection