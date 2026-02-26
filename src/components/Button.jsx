import React from 'react';
import Icon from './Icon';

function Button({ text = 'Button', onClick, className = '', type = 'button'}) {
  return (
    <button
      type={`${type}`}
      className={`flex justify-center bg-green-50 text-xs px-4 font-bold rounded-full
      hover:bg-green-700 hover:text-white border-opacity-60 border border-green-600 text-green-800 p-2 ${className}`}
      onClick={onClick}
    >
       <p className='font-bold text-xs'>{text}</p>
    </button>
  );
}

function ButtonIcon({ text = 'Button', onClick, className = '', type = 'button', dataFeather = '', iconClassName = ''}) {
  return (
    <button
      type={`${type}`}
      className={`group flex bg-green-50 p-1 items-center rounded-full pr-2 text-xs font-bold h-fit
      hover:bg-green-700 hover:text-white text-green-800  ${className}`}
      onClick={onClick}
    >
      <Icon dataFeather={dataFeather} className={`group-hover:text-white text-green-800 ${iconClassName}`} />
      <p className='font-bold text-xs pr-4 text-nowrap'>{text}</p>
    </button>
  );
}


export default Button;
export { ButtonIcon }

