import icon from '../assets/unitask.svg'
import { IconAction } from './Icon'

function TitleSection({title = 'Title', className = '', titleClassName = ''}) {
  return ( 
    <section className={`flex w-full mb-4 justify-between z-0 ${className}`}>
      <section className='flex flex-col w-full'>
        <p className={` w-full max-w-[80%] overflow-hidden overflow-ellipsis font-bold text-[0.9rem] text-slate-800 ${titleClassName}`}>{title}</p>
      </section>
    </section>
  )
}

function HeadTitleSection({title = 'Title', className = '', nextTitle}) {
  return ( 
    <section className='flex w-full mb-4 justify-between pb-4'>
        <span className={`flex gap-2 h-full items-center font-semibold ${className}`}>
          <img src={icon} className='h-7 w-7' alt="" />
          <span className='border-l-2 pl-2'>
            <h2 className='text-lg text-green-700 font-bold'>{title}</h2>
            <h2>{nextTitle}</h2>
          </span>
        </span>
    </section>
  )
}

function IconTitleSection({title = 'Title', iconOnClick, dataFeather = '', iconText='',  extraIcon, className= '', titleClassName = "", underTitle = ''}) {
  return ( 
    <section className={`flex w-full mb-4 justify-between z-0 ${className}`}>
      <section className='flex flex-col w-full'>
        <p className={` w-full text-start max-w-[80%] overflow-hidden overflow-ellipsis font-bold text-[0.9rem] text-slate-800 ${titleClassName}`}>{title}</p>
        {(underTitle) && (
          <p className='text-[0.7rem] text-gray-800 font-semibold'>{underTitle}</p>
        )}
      </section>
      <span className='flex gap-2'>
        {extraIcon}
        {dataFeather && (
          <IconAction
            dataFeather={dataFeather}
            iconOnClick={iconOnClick}
            text={iconText}
          />
        )}
      </span>
    </section>
  )
}

function MultiTitleSection({ titles = {}, className = ''}) {
  return (
    <section className={`flex w-full mb-4 justify-between items-center border-b-2  pb-2 ${className}`}>
      <div className="flex gap-2 items-center">
        {titles.map((titleObj, index) => (
          <IconAction
            key={index}
            text={titleObj.label}
            iconOnClick={titleObj.onClick}
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


function DisplayTitleSection({title = 'Title', displayCount = '0', className = '', countClassName = ''}) {
  
  return ( 
    <section
      className={`flex items-center px-1.5 py-1 border border-dotted border-green-700 text-green-900 w-fit mb-2 gap-2
      bg-green-100 rounded-md ${className}`}
    >
      <span className="flex items-center text-xs font-semibold tracking-wide">
        {title}
      </span>

      <span
        className={`flex items-center justify-center min-w-[1.25rem] min-h-[1.25rem] bg-green-700  rounded-[4px]
       border-green-700 text-white text-xs font-bold ${countClassName}`}
      >
        {displayCount}
      </span>
    </section>
  )
}


export default TitleSection
export { DisplayTitleSection, HeadTitleSection, IconTitleSection, MultiTitleSection }

