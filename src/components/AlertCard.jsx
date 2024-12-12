import React from 'react'
import Button from './Button'

function AlertCard({text = 'Title', count = 0, className = '', user = 'User', taskName = 'Task'}) {
  return (
  <section className={`flex flex-col bg-green-800 w-full cursor-pointer rounded-md
                       p-4 justify-between text-white h-auto shadow-sm`}>
      <span >
        <h2 className='font-semibold mb-2'>{text}</h2>
        <p className='text-sm'>Hi <u>{user}</u>, Tasks for today</p>
      </span>
      <section className='flex items-start py-8'>
        <span className="flex flex-col items-center">
          <p className='font-bold text-4xl'>{count}</p>
          <p className='font-semibold text-sm'>{taskName}</p>
        </span>
      </section>
      <Button text='Check Pending' className='text-white border-white hover:bg-green-900'/>
    </section>
  )
}

function AlertBox({text = 'Title', className = '', email= 'User'}) {
  return (
  <section className={`flex flex-col bg-green-50 border text-green-900 border-green-300 w-full cursor-pointer rounded-2xl
                       p-4 justify-between h-auto shadow-sm ${className}`}>
      <span >
        <h2 className='font-semibold mb-2'>Welcome to UniTask! {email}</h2>
        <p>{text}</p>
      </span>
    </section>
  )
}

export default AlertCard

export { AlertBox }