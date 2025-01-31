import React from 'react';
import { IconTitleSection } from './TitleSection';
import { CanvasCard } from './Cards';

function CanvasSection() {
  return (
    <div className='w-full h-full flex flex-col bg-white rounded-md p-4'>
      <IconTitleSection title='Canvas' dataFeather='plus' />
      <section className='grid grid-cols-2 gap-2'>
        <CanvasCard />
      </section>
    </div>
  )
}

export default CanvasSection