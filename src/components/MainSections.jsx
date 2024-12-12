import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import { CreateProject } from './modal-group/Modal';
import { UserNotes } from './Notes';
import { CreateNote } from './modal-group/Modal'; 
import { IconTitleSection } from './TitleSection';
import { CreateProjectCard } from './ProjectCard';
import { CreateNoteCard } from './Notes';

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
      <IconTitleSection title='Projects' dataFeather='filter'/>
      {showPopUp && <CreateProject closeModal={togglePopUp} onSave={handleSaveProject}/> }
      <section className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 w-full h-auto overflow-y-scroll pr-2">
      <CreateProjectCard onClick={togglePopUp}/>

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
      <IconTitleSection title='Projects' dataFeather='filter'/>
      {showPopUp && <CreateNote closeModal={togglePopUp} onSave={handleSaveNote} />}
        
      <section className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 w-full h-auto overflow-y-scroll pr-2">
        <CreateNoteCard onClick={togglePopUp} />
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
