import { createContext, useContext, useEffect, useState } from "react";

const LayoutContext = createContext();

export const useLayout = () => useContext(LayoutContext);

const STORAGE_KEY = "compactView";

export const LayoutProvider = ({ children }) => {
  const [compactView, setCompactView] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : false;
    } catch (error) {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compactView));
    } catch (error) {
      // Ignore storage errors (private mode, blocked storage, etc.).
    }
  }, [compactView]);

  const toggleCompactView = () => setCompactView((prev) => !prev);

  return (
    <LayoutContext.Provider value={{ compactView, setCompactView, toggleCompactView }}>
      {children}
    </LayoutContext.Provider>
  );
};
