import { useState, createContext, useContext } from 'react';

export const ProjectContext = createContext();

export const useProjectContext = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [activeProjectId, setActiveProjectID] = useState(null);

  const setProjectID = (id) => {
    setActiveProjectID(id);
  }

  const fetchID = () => {
    if (activeProjectId) {
      try {
        return activeProjectId;
      } catch (error) {
        alert("Error accessing project ID");
        console.log("Project ID cannot be accessed: ", error);
      }
    } else {
      alert('The project seems to not exist: Try reloading the application');
      throw new Error("Error fetching project id: The project does not exist.");
    }
  };


  return (
    <ProjectContext.Provider value={{activeProjectId, setProjectID, fetchID}}>
      {children}
    </ProjectContext.Provider>
  )
}
