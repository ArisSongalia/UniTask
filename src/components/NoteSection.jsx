import { where } from 'firebase/firestore';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { useReloadContext } from '../context/ReloadContext';
import { useFetchActiveProjectData, useFetchNoteData } from '../services/FetchData';
import { NoteCard } from './Cards';
import { IconTitleSection } from './TitleSection';
import { CreateNote } from './modal-group/Modal';

function NoteSection({className = ''}) {
  const [showPopUp, setShowPopUp] = useState(false);
  const { key } = useReloadContext();
  const { projectId } = useParams();

  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  }

  const { projectData } = useFetchActiveProjectData(projectId, key)
  const customWhere = where("project-id", "==", projectId);
  const { noteData, loading } = useFetchNoteData(key, customWhere)

  return (
    <div id='note-div' className={'flex flex-col bg-white rounded-lg overflow-y-hidden h-full'}>
      <IconTitleSection title='Project Notes' dataFeather='plus' iconOnClick={togglePopUp} titleClassName=''/>
      {showPopUp && <CreateNote closeModal={togglePopUp} projectData={projectData}/>}

      <section className={`grid grid-cols-3 2 sm:grid-cols-4 xl:grid-cols-5 gap-2 ${className}`}>
        {loading ? (
          <BarLoader color='#228B22' size={20} />
        ) : (
          noteData.map((note, index) => (
            <NoteCard
              key={`${note.id}-${index}`}
              noteData={note}
            />
          ))
        )}
      </section>

    </div>
  )
}

export default NoteSection