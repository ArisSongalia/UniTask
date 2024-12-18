import React, { useState } from 'react';
import { IconAction } from './Icon';

const RefreshComponentIcon = ({ setRefreshKey }) => {
  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <span>
      <IconAction dataFeather='refresh-cw' iconOnClick={handleRefresh}/>
    </span>
  );
};

export { RefreshComponentIcon };
