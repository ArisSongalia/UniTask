import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import { CreateProject } from './Modal';
import { UserNotes } from './Notes';
import { CreateNote } from './Modal'; 
import TitleSection from './TitleSection';

function MainProjectSection() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [project, setProject] = useState([]);

  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  }

  const handleSaveProject = (newProject) => {
    setProject([...project, newProject]);
    togglePopUp();
  }

  return (
    <div className="w-full">
      <TitleSection title='Projects' buttonText='Create Project' buttonOnClick={togglePopUp}/>
      {showPopUp && <CreateProject closeModal={togglePopUp} onSave={handleSaveProject}/> }
      <section className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 w-full h-auto overflow-y-scroll pr-2">
        {project.map((project, index) => (
          <ProjectCard 
            key={index}
            title={project.title}
            description={project.description}
            date={project.date}
            type={project.type}
          />
        ))}
      </section>
    </div>
  );
}

function MainNotesSection() {
  const [notes, setNotes] = useState([]);  
  const [showPopUp, setShowPopUp] = useState(false); 

  const togglePopUp = () => {
    setShowPopUp(!showPopUp); 
  };

  const handleSaveNote = (newNote) => {
    setNotes([...notes, newNote]);
    togglePopUp(); 
  };

  return (
    <div className='w-full'>
      <TitleSection title='Notes' buttonText='Add Note' buttonOnClick={togglePopUp} />
      {showPopUp && <CreateNote closeModal={togglePopUp} onSave={handleSaveNote} />}
        
      <section className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 w-full h-auto overflow-y-scroll pr-2">
        {notes.map((note, index) => (
          <UserNotes
            key={index}
            title={note.title}
            message={note.message}
            user="You"
            date={note.date}
            file={note.file}
          />
        ))}
      </section>
    </div>
  );
}

export { MainNotesSection, MainProjectSection };
