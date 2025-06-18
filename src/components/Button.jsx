import React from 'react';
import Icon from './Icon';

function Button({ text = 'Button', onClick, className = '', type = 'button', iconClassName = ''}) {
  return (
    <button
      type={`${type}`}
      className={`flex justify-center bg-green-50 text-xs px-4 font-bold rounded-full
      hover:bg-green-700 hover:text-white border-opacity-60 text-green-800 p-3 ${className}`}
      onClick={onClick}
    >
       <p className='font-bold text-xs'>{text}</p>
    </button>
  );
}

function ButtonIcon({ text = 'Button', onClick, className = '', type = 'button', dataFeather = ''}) {
  return (
    <button
      type={`${type}`}
      className={`group flex text-green-800 bg-green-50  p-1 items-center rounded-full text-xs pl-3 pr-4 font-bold h-fit
      hover:bg-green-700 hover:text-white border-opacity-60 ${className}`}
      onClick={onClick}
    >
      <Icon dataFeather={dataFeather} className='group-hover:text-white text-white' />
      <p className='font-bold text-xs'>{text}</p>
    </button>
  );
}


export default Button;
export { ButtonIcon }

