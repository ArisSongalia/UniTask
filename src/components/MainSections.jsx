import React, { useState } from 'react';
import ProjectCard from './Cards';
import { CreateProject } from './modal-group/Modal';
import { UserNotes } from './Notes';
import { CreateNote } from './modal-group/Modal'; 
import { IconTitleSection } from './TitleSection';
import { CreateCard } from './Cards';
import { doc } from 'firebase/firestore';
import { db, auth} from '../config/firebase';


function MainProjectSection() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [project, setProject] = useState([]);

  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  }

  return (
    <div className="w-full">
      <IconTitleSection title='Projects' dataFeather='filter'/>
      <section className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 w-full h-auto overflow-y-scroll pr-2">
      <CreateCard 
        onClick={togglePopUp} 
        title='Create Project' 
        description='Get started! Manage tasks individually or collaboratively.' 
      />
      {showPopUp && <CreateProject closeModal={togglePopUp}/>}

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
      <section className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 w-full h-auto overflow-y-scroll pr-2">
        <CreateCard  
          onClick={togglePopUp} 
          title='Write a Note' 
          description='Write a note for you or yourself'
        />
        {showPopUp && <CreateNote closeModal={togglePopUp} onSave={handleSaveNote}/>}

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
