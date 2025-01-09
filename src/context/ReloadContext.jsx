import React, { createContext, useContext, useState } from 'react';

const ReloadContext = createContext();

export const useReloadContext = () => useContext(ReloadContext);

export const ReloadProvider  = ({ children }) => {
  const [key, setKey] = useState(0);

  const reloadComponent = () => {
    setKey(prevKey => prevKey + 1);
  }

  return (
    <ReloadContext.Provider value={{ key, reloadComponent}}>
      {children}
    </ReloadContext.Provider>
  )
}