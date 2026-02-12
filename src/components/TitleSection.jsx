import icon from '../assets/unitask.svg'
import { ButtonIcon } from './Button'
import { IconAction } from './Icon'
import Button from './Button'

function TitleSection({title = 'Title', buttonText = 'Button', buttonOnClick, className = '', nextTitle = '', extraIcon, buttonVisible}) {
  return ( 
    <section className='flex w-full mb-4 justify-between'>
        <span className={`flex gap-2 h-full items-center font-semibold ${className}`}>
          <h2>{title}</h2>
          <h2>{nextTitle}</h2>
        </span>
      <span>

      {buttonVisible === false ?  (
        null
      ) : (
        <span className='flex gap-2'>
        <Button text={`${buttonText}`} onClick={buttonOnClick}/>
        {extraIcon}
      </span>
      )}
      </span>

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

function IconTitleSection({title = 'Title', iconOnClick, dataFeather = '', extraIcon, className= '', titleClassName = "", underTitle = ''}) {
  return ( 
    <section className={`flex w-full mb-4 justify-between z-0 ${className}`}>
      <section className='flex flex-col w-full'>
        <p className={` w-full max-w-[80%] overflow-hidden overflow-ellipsis font-bold text-[0.9rem] text-slate-800 ${titleClassName}`}>{title}</p>
        {(underTitle) && (
          <p className='text-[0.7rem] text-gray-800 font-semibold'>{underTitle}</p>
        )}
      </section>
      <span className='flex gap-2'>
        <IconAction dataFeather={`${dataFeather}`} iconOnClick={iconOnClick}/>
        {extraIcon}
      </span>
    </section>
  )
}

function MultiTitleSection({ titles}) {
  return (
    <section className="flex w-full mb-4 justify-between items-center border-b-2  pb-2">
      <div className="flex gap-2 items-center">
        {titles.map((titleObj, index) => (
          <ButtonIcon
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


function DisplayTitleSection({title = 'Title', displayCount = '0', className = '', countClassName = ''}) {
  
  return ( 
    <section className={`flex p-1 text-white w-fit mb-2 gap-2 bg-green-700 justify-between rounded-full ${className}`}>
        <span className='flex gap-2 h-full items-center font-semibold text-xs ml-1'>
          <h2 className=''>{title}</h2>
        </span>
        <span className={`flex items-center font-semibold h-5 w-5 justify-center rounded-full bg-white text-green-800 text-sm ${countClassName}`}>
          <h2>{displayCount}</h2>
        </span>
    </section>
  )
}


export default TitleSection
export { DisplayTitleSection, HeadTitleSection, IconTitleSection, MultiTitleSection }
