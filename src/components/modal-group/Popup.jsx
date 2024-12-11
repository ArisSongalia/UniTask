import React from 'react'
import Icon from '../Icon'
import { IconTitleSection} from '../TitleSection'

function Popup({title, closeModal}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col p-4 bg-white rounded-2xl w-[15rem] h-auto">
        <IconTitleSection title={title} iconOnClick={closeModal} className='items-center' dataFeather='x' />
        <section className="flex items-center p-2 gap-2 rounded-2xl w-full hover:bg-green-200 hover:bg-opacity-30 cursor-pointer">
          <Icon dataFeather='archive' />
          <p>Archieve</p>
        </section>
        <section className="flex items-center p-2 gap-2 rounded-2xl w-full hover:bg-green-200 hover:bg-opacity-30 cursor-pointer">
          <Icon dataFeather='trash'/>
          <p>Delete</p>
        </section>
      </div>
    </div>
  )
}

export default Popup