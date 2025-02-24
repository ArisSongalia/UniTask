import React, { useState } from 'react'
import Button from './Button'
import { IconAction } from './Icon'

function TitleSection({title = 'Title', buttonText = 'Button', buttonOnClick, className = '', nextTitle = '', extraIcon}) {
  return ( 
    <section className='flex w-full mb-4 justify-between'>
        <span className={`flex gap-2 h-full items-center font-semibold ${className}`}>
          <h2>{title}</h2>
          <h2>{nextTitle}</h2>
        </span>
      <span>
        <span className='flex gap-2'>
          <Button text={`${buttonText}`} onClick={buttonOnClick}/>
          {extraIcon}
        </span>
      </span>

    </section>
  )
}

function IconTitleSection({title = 'Title', iconOnClick, dataFeather = '', extraIcon, className= ''}) {
  return ( 
    <section className={`flex w-full mb-4 justify-between ${className}`}>
      <h2 className='font-semibold w-full max-w-[80%] overflow-hidden overflow-ellipsis'>{title}</h2>
      <span className='flex gap-2'>
        <IconAction dataFeather={`${dataFeather}`} iconOnClick={iconOnClick}/>
        {extraIcon}
      </span>
    </section>
  )
}

function MultiTitleSection({ titles, dataFeather = ''}) {
  return (
    <section className="flex w-full mb-4 justify-between items-center border-b-2  pb-2">
      <div className="flex gap-2 items-center">
        {titles.map((titleObj, index) => (
          <Button
            key={index}
            text={titleObj.label}
            onClick={titleObj.onClick}
            dataFeather={titleObj.dataFeather}
            className={`${
              titleObj.isActive ? 'text-white bg-green-700' : 'bg-solid'
            }`}
            iconClassName={`${
              titleObj.isActive ? 'text-white' : 'bg-solid'
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
        <span className={`flex items-center font-semibold h-8 justify-center w-8 rounded-full bg-green-50 text-green-800 text-sm rounded-full' ${displayClassName}`}>
          <h2>{displayCount}</h2>
        </span>
    </section>
  )
}


export default TitleSection
export { MultiTitleSection, IconTitleSection, DisplayTitleSection }