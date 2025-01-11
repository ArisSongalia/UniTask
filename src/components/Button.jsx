import React from 'react';

function Button({ text = 'Button', onClick, className = '', type = 'button'}) {

  return (
    <button
      type={`${type}`}
      className={`p-2 rounded-md border border-green-700 text-xs px-4 font-bold h-fit
      hover:bg-green-700 hover:text-white border-opacity-60 text-green-800 ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;

