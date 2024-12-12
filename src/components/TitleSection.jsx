import React, { useState } from 'react'
import Button from './Button'
import { IconAction } from './Icon'

function TitleSection({title = 'Title', buttonText = 'Button', buttonOnClick, className = '', nextTitle = ''}) {
  return ( 
    <section className='flex w-full mb-4 justify-between'>
        <span className={`flex gap-2 h-full items-center font-semibold ${className}`}>
          <h2>{title}</h2>
          <h2>{nextTitle}</h2>
        </span>
      <Button text={`${buttonText}`} onClick={buttonOnClick}/>
    </section>
  )
}

function IconTitleSection({title = 'Title', iconOnClick, dataFeather = '', className= ''}) {
  return ( 
    <section className={`flex w-full mb-4 justify-between ${className}`}>
      <h2 className='font-semibold'>{title}</h2>
      <IconAction dataFeather={`${dataFeather}`} iconOnClick={iconOnClick}/>
    </section>
  )
}

function MultiTitleSection({ titles }) {
  return (
    <section className="flex w-full mb-4 justify-between items-center border-b-2  pb-2">
      <div className="flex gap-2 items-center">
        {titles.map((titleObj, index) => (
          <Button
            key={index}
            text={titleObj.label}
            onClick={titleObj.onClick}
            className={`cursor-pointer px-4 py-2 rounded-lg ${
              titleObj.isActive ? 'text-white bg-green-700' : 'bg-solid'
            }`}
          />
        ))}
      </div>
    </section>
  );
}


function DisplayTitleSection({title = 'Title', displayCount = '0', className = '', displayClassName = ''}) {
  return ( 
    <section className='flex w-full mb-4 justify-between'>
        <span className={`flex gap-2 h-full items-center font-semibold ${className}`}>
          <h2>{title}</h2>
        </span>
        <span className={`flex gap-9 items-center font-semibold px-4 rounded-full bg-green-50 text-green-800 text-sm rounded-full' ${displayClassName}`}>
          <h2>{displayCount}</h2>
        </span>
    </section>
  )
}


export default TitleSection
export { MultiTitleSection, IconTitleSection, DisplayTitleSection }