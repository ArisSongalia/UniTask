import React from 'react'

function ProgressLine25({className = ''}) {
  return (
    <span className={`bg-violet-600 h-1 w-[1/4] rounded-lg ${className}`}>
    </span>
  )
}

function ProgressLine50({className = ''}) {
  return (
    <span className={`bg-violet-600 h-1 w-[2/4] rounded-lg ${className}`}>
    </span>
  )
}
function ProgressLine75({className = ''}) {
  return (
    <span className={`bg-violet-600 h-1 w-[3/4] rounded-lg ${className}`}>
    </span>
  )
}
function ProgressLine100({className = ''}) {
  return (
    <span className={`bg-violet-600 h-1 w-full rounded-lg ${className}`}>
    </span>
  )
}



export default ProgressLine100
export {ProgressLine25, ProgressLine50, ProgressLine75}