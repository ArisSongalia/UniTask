import { createContext, useContext, useEffect, useState } from "react";

const LayoutContext = createContext();

export const useLayout = () => useContext(LayoutContext);

const STORAGE_KEY = "compactView";
const TEXT_SIZE_KEY = "largeText";

export const LayoutProvider = ({ children }) => {
  const [compactView, setCompactView] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : false;
    } catch (error) {
      return false;
    }
  });

  const [largeText, setLargeText] = useState(() => {
    try {
      const stored = localStorage.getItem(TEXT_SIZE_KEY);
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

  useEffect(() => {
    try {
      localStorage.setItem(TEXT_SIZE_KEY, JSON.stringify(largeText));
    } catch (error) {
      // Ignore storage errors (private mode, blocked storage, etc.).
    }
  }, [largeText]);

  const toggleCompactView = () => setCompactView((prev) => !prev);
  const toggleLargeText = () => setLargeText((prev) => !prev);

  return (
    <LayoutContext.Provider value={{ compactView, setCompactView, toggleCompactView, largeText, setLargeText, toggleLargeText }}>
      {children}
    </LayoutContext.Provider>
  );
};
