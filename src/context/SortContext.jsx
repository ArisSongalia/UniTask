import { createContext, useContext, useState, useEffect } from "react";

const SortContext = createContext();
export const useSort = () => useContext(SortContext);

export const SortProvider = ({ children }) => {
  const [sortState, setSortState] = useState(() => {
    const stored = localStorage.getItem("sortState");
    return stored ? JSON.parse(stored) : { title: null, date: null, progress: null };
  });

  useEffect(() => {
    localStorage.setItem("sortState", JSON.stringify(sortState));
  }, [sortState]);

  return (
    <SortContext.Provider value={{sortState, setSortState }}>
      {children}
    </SortContext.Provider>
  );
};