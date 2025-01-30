import React, {useState, useEffect} from 'react';
import Notes from './Notes';
import {IconTitleSection} from './TitleSection';
import { CreateNote } from './modal-group/Modal';
import { fetchNoteData } from '../services/FetchData';
import { useReloadContext } from '../context/ReloadContext';
import { where } from 'firebase/firestore';
import { BarLoader } from 'react-spinners';

function NoteSection({className = ''}) {
  const [showPopUp, setShowPopUp] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { key } = useReloadContext();
  const activeProjectId = localStorage.getItem('activeProjectId');


  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  }

  const customWhere = where("project-id", "==", activeProjectId);
  fetchNoteData(setNotes, setLoading, key, customWhere);

  
  return (
    <div id='note-div' className={'flex flex-col p-4 bg-white rounded-md overflow-y-hidden h-full shadow-sm'}>
      <IconTitleSection title='Notes' dataFeather='plus' iconOnClick={togglePopUp} />
      {showPopUp && <CreateNote closeModal={togglePopUp} projectId={activeProjectId}/>}

      <section className={`grid grid-cols-2 sm:grid-cols-1 xl:grid-cols-2 gap-2 w-full bg-white pr-2 rounded-xl overflow-y-auto ${className}`}>
        {loading ? (
          <BarLoader color='#228B22' size={20} />
        ) : (
          notes.map((note, index) => (
            <Notes
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