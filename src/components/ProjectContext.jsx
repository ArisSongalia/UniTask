import { useState, createContext, useContext } from 'react';

export const ProjectContext = createContext();

export const useProjectContext = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [activeProjectId, setActiveProjectID] = useState(null);

  const setProjectID = (id) => {
    setActiveProjectID(id);
  }

  const fetchID = () => {
    console.log(activeProjectId);
  }

  return (
    <ProjectContext.Provider value={{activeProjectId, setProjectID, fetchID}}>
      {children}
    </ProjectContext.Provider>
  )
}
