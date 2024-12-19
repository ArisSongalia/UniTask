import React, { useState } from 'react';
import { IconAction } from './Icon';

const RefreshComponent = ({ setRefreshKey }) => {
  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  handleRefresh();
};

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


export default RefreshComponent;
export { RefreshComponentIcon };
