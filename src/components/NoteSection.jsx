import React, {useState, useEffect} from 'react';
import {IconTitleSection} from './TitleSection';
import { CreateNote } from './modal-group/Modal';
import { useFetchNoteData } from '../services/FetchData';
import { useReloadContext } from '../context/ReloadContext';
import { where } from 'firebase/firestore';
import { BarLoader } from 'react-spinners';
import { NoteCard } from './Cards';

function NoteSection({className = ''}) {
  const [showPopUp, setShowPopUp] = useState(false);
  const { key } = useReloadContext();
  const activeProjectId = localStorage.getItem('activeProjectId');

  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  }

  const customWhere = where("project-id", "==", activeProjectId);
  const { noteData, loading } = useFetchNoteData(key, customWhere)

  
  return (
    <div id='note-div' className={'flex flex-col p-4 bg-white rounded-lg overflow-y-hidden h-full shadow-sm'}>
      <IconTitleSection title='Notes' dataFeather='plus' iconOnClick={togglePopUp} />
      {showPopUp && <CreateNote closeModal={togglePopUp} projectId={activeProjectId}/>}

      <section className={`grid grid-cols-2 sm:grid-cols-1 xl:grid-cols-2 gap-2 w-full h-full bg-white pr-2 rounded-xl overflow-y-auto ${className}`}>
        {loading ? (
          <BarLoader color='#228B22' size={20} />
        ) : (
          noteData.map((note, index) => (
            <NoteCard
              key={`${note.id}-${index}`}
              title={note.title}
              message={note.message}
              user="You"
              date={note.date}
              id={note.id}
              className='h-fit rounded-xl'
            />
          ))
        )}
      </section>

    </div>
  )
}

export default NoteSection