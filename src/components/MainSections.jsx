import React, { useEffect, useState } from 'react';
import { ProjectCard, CreateCard } from './Cards';
import { CreateProject, CreateNote} from './modal-group/Modal';
import { IconTitleSection } from './TitleSection';
import { fetchProjectData, fetchNoteData } from '../services/FetchData';
import { BarLoader } from 'react-spinners';
import { ReloadIcon } from './ReloadComponent';
import { useReloadContext } from '../context/ReloadContext';
import { NoteCard } from './Cards';


function MainProjectSection() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { key } = useReloadContext();

  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  };

  fetchProjectData( setProjects, setLoading, key)

  return (
    <div className="flex flex-col w-full h-full">
      <IconTitleSection 
        title='Projects' 
        dataFeather='filter' 
        extraIcon={<ReloadIcon />} 
        className='sticky top-0 bg-white pb-2'
      />  
      
      <section id='project-container' className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 flex-grow-0 gap-2">
        <CreateCard 
          onClick={togglePopUp} 
          title='Create Project' 
          description='Get started! Manage tasks individually or collaboratively.' 
        />
        {showPopUp && <CreateProject closeModal={togglePopUp} />}

        
        {loading ? (
          <span><BarLoader color='#228B22' size={20} /></span>
        ) : (
          projects.length > 0 && (
            projects.map((project, index) => (
                <ProjectCard
                  key={`${project.id}-${index}`}
                  title={project.title}
                  description={project.description}
                  date={project.date}
                  type={project.type}
                  id={project.id}
                  status={project.status}
                />
            ))
          )
        )}
      </section>
    </div>
  );
}

function MainNotesSection() {
  const [notes, setNotes] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [showPopUp, setShowPopUp] = useState(false); 
  const { key } = useReloadContext();

  const togglePopUp = () => {
    setShowPopUp(!showPopUp); 
  };

  fetchNoteData(setNotes, setLoading, key);

  return (
    <div className='w-full h-fit'>
      <IconTitleSection 
        title='Notes' 
        dataFeather='filter'
        extraIcon={<ReloadIcon />}
        className='sticky top-0 bg-white pb-2'
      />  
      <section id='note-container' className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 flex-grow-0 gap-2">
        <CreateCard  
          onClick={togglePopUp} 
          title='Create Note' 
          description='Write a note for you or yourself'
        />
        {showPopUp && <CreateNote closeModal={togglePopUp} />}

        {loading ? (
          <span><BarLoader color='#228B22' size={20} /></span>
        ) : (
          notes.length > 0 &&
            notes.map((note, index) => (
              <NoteCard
                key={`${note.id}-${index}`}
                title={note.title}
                message={note.message}
                date={note.date}
                file={note.file}
                id={note.id}
              />
            ))
        )}
      </section>
    </div>
  );
}

export { MainNotesSection, MainProjectSection };
