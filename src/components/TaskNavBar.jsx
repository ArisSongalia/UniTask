import React from 'react'
import { IconAction } from './Icon'
import { Link } from 'react-router-dom'

function TaskNavBar({date = '00/00/00', title = 'Project Title'}) {
  return (
    <div className='bg-white flex items-center justify-center w-full h-auto shadow-sm'>
      <div className='flex max-w-screen-2xl w-full p-4 justify-between items-center'>
        <span className='flex gap-4 items-center'>
          <Link to='/'>
            <IconAction dataFeather='arrow-left' className='h-[2.5rem] w-[2.5rem]' style={{ width: '2rem', height: '2rem', strokeWidth: '3' }} />
          </Link>
          <span className='flex flex-col'>
            <h1 className='text-xl font-bold mb-1 text-green-700'>{title}</h1>
            <p className="text-xs text-gray-600 font-semibold">{date}</p>
          </span>
        </span>
        <span className='flex items-center gap-4'>
          <span id="task-user" className='flex gap-1'>
            <IconAction dataFeather='user' />
            <IconAction dataFeather='user' />
            <IconAction dataFeather='user' />
          </span>
          <IconAction className='' dataFeather='plus' />
        </span>
      </div>
    </div>
  )
}

export default TaskNavBar
