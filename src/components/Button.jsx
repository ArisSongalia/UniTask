import React from 'react';
import Icon from './Icon';

function Button({ text = 'Button', onClick, className = '', type = 'button', dataFeather = 'arrow-right', iconClassName = ''}) {
  return (
    <button
      type={`${type}`}
      className={`group flex justify-between items-center p-1 rounded-md bg-green-50 text-xs px-4 font-bold h-fit 
      hover:bg-green-700 hover:text-white border-opacity-60 text-green-800 ${className}`}
      onClick={onClick}
    >
      {text}
      <Icon dataFeather={dataFeather} className={`group-hover:text-white ${iconClassName}`} />
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

