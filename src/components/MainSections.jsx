import React, { useEffect, useState } from 'react';
import { ProjectCard, CreateCard } from './Cards';
import { CreateProject, CreateNote } from './modal-group/Modal';
import { UserNotes } from './Notes';
import { IconTitleSection } from './TitleSection';
import { fetchProjectData, fetchNoteData } from './FetchData';
import { BarLoader } from 'react-spinners';
import { RefreshComponentIcon } from './RefreshComponent';


function MainProjectSection() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  };

  fetchProjectData(setProjects, setLoading, refreshKey)

  return (
    <div className="flex flex-col w-full h-full">
      <IconTitleSection 
        title='Projects' 
        dataFeather='filter' 
        extraIcon={<RefreshComponentIcon setRefreshKey={setRefreshKey}/>} 
        className='sticky top-0 bg-white pb-2'
      />  
      
      <section id='project-container' className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 flex-grow-0 gap-2">
        <CreateCard 
          onClick={togglePopUp} 
          title='Create Project' 
          description='Get started! Manage tasks individually or collaboratively.' 
        />
        {showPopUp && <CreateProject closeModal={togglePopUp} setRefreshKey={setRefreshKey}/>}

        {loading ? (
          <span><BarLoader color='#228B22' size={20} /></span>
        ) : ( 
          projects.length > 0 &&
            projects.map((project, index) => (
              <ProjectCard 
                key={index}
                title={project.title}
                description={project.description}
                date={project.date}
                type={project.type}
              />
            ))
        )}
      </section>
    </div>
  );
}

function MainNotesSection() {
  const [notes, setNotes] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [showPopUp, setShowPopUp] = useState(false); 
  const [refreshKey, setRefreshKey] = useState(0);

  const togglePopUp = () => {
    setShowPopUp(!showPopUp); 
  };

  fetchNoteData(setNotes, setLoading, refreshKey);

  return (
    <div className='w-full h-fit'>
      <IconTitleSection 
        title='Notes' 
        dataFeather='filter'
        extraIcon={<RefreshComponentIcon setRefreshKey={setRefreshKey}/>}
        className='sticky top-0 bg-white pb-2'
      />  
      <section id='note-container' className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 w-full ">
        <CreateCard  
          onClick={togglePopUp} 
          title='Write a Note' 
          description='Write a note for you or yourself'
        />
        {showPopUp && <CreateNote closeModal={togglePopUp} setRefreshKey={setRefreshKey} />}

        {loading ? (
          <span><BarLoader color='#228B22' size={20} /></span>
        ) : (
          notes.length > 0 &&
            notes.map((note, index) => (
              <UserNotes
                key={index}
                title={note.title}
                message={note.message}
                user="You"
                date={note.date}
                file={note.file}
              />
            ))
        )}
      </section>
    </div>
  );
}

export { MainNotesSection, MainProjectSection };
