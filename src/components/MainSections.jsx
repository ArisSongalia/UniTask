import React, { useEffect, useState } from 'react';
import { ProjectCard, CreateCard } from './Cards';
import { CreateProject, CreateNote} from './modal-group/Modal';
import { IconTitleSection } from './TitleSection';
import { useFetchProjectData, useFetchNoteData } from '../services/FetchData';
import { BarLoader } from 'react-spinners';
import { ReloadIcon } from './ReloadComponent';
import { useReloadContext } from '../context/ReloadContext';
import { NoteCard } from './Cards';
import { FilterPopup } from './modal-group/Popup';
import { useSort } from '../context/SortContext';


function MainProjectSection() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [showFilter, setShowFilter] = useState(false); 
  const { key } = useReloadContext();
  const { sortState } = useSort();

  const activeSort = Object.entries(sortState).find(([key, value]) => value);
  const orderValue = activeSort ? activeSort[0] : null;
  const orderPos = activeSort ? activeSort[1] : "asc";

  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  };

  const toggleShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const { projectData, loading } = useFetchProjectData(key, orderValue, orderPos)

  return (
    <div className="flex flex-col w-full h-full">
      <div className="relative">
        <IconTitleSection
          title='Projects'
          dataFeather='filter'
          iconOnClick={toggleShowFilter}
          extraIcon={<ReloadIcon />}
          titleClassName='text-base'
          className='sticky top-0 bg-white'
        />
        {showFilter && <FilterPopup closeModal={toggleShowFilter} /> }
      </div>
      
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
          projectData.length > 0 && (
            projectData.map((project) => (
                <ProjectCard
                  key={project.id}
                  projectData={project}
                />
            ))
          )
        )}
      </section>
    </div>
  );
}

function MainNotesSection() {
  const [showPopUp, setShowPopUp] = useState(false); 
  const { key } = useReloadContext();
  const [showFilter, setShowFilter] = useState(false);

  const togglePopUp = () => setShowPopUp(!showPopUp); 
  const toggleShowFilter = () => setShowFilter(!showFilter);

  const { noteData, loading } = useFetchNoteData(key);

  return (
    <div className="relative w-full h-full">
      <IconTitleSection
        title='Notes'
        dataFeather='filter'
        extraIcon={<ReloadIcon />}
        titleClassName='text-base'
        className='sticky top-0 bg-white z-10'
        iconOnClick={toggleShowFilter} 
      />

      {showFilter && (<FilterPopup closeModal={toggleShowFilter} /> )}
    
      {/* Cards Grid */}
      <section id='note-container' className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 mt-4">
        <CreateCard  
          onClick={togglePopUp} 
          title='Create Note' 
          description='Write a personal note.'
        />
        
        {showPopUp && <CreateNote closeModal={togglePopUp} />}

        {loading ? (
            <BarLoader color='#228B22' size={20} />
        ) : (
          noteData?.map((note, index) => (
            <NoteCard
              key={`${note.id}-${index}`}
              noteData={note}
            />
          ))
        )}
      </section>
    </div>
  );
}

export { MainNotesSection, MainProjectSection };
