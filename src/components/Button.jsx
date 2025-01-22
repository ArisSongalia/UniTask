import React from 'react';
import Icon from './Icon';
import { data } from 'autoprefixer';

function Button({ text = 'Button', onClick, className = '', type = 'button'}) {
  return (
    <button
      type={`${type}`}
      className={`p-2 rounded-full bg-green-50 text-xs px-4 font-bold h-fit 
      hover:bg-green-700 hover:text-white border-opacity-60 text-green-700 ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

function ButtonIcon({ text = 'Button', onClick, className = '', type = 'button', dataFeather = ''}) {
  return (
    <button
      type={`${type}`}
      className={`group flex p-1 items-center rounded-full bg-green-50 text-xs pl-3 pr-4 font-bold h-fit 
      hover:bg-green-700 hover:text-white border-opacity-60 text-green-700 ${className}`}
      onClick={onClick}
    >
      <Icon dataFeather={dataFeather} className='group-hover:text-white' />
      {text}
    </button>
  );
}


export default Button;
export { ButtonIcon }

