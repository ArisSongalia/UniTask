import React, {useState} from 'react'
import Notes, { UserNotes } from './Notes'
import TitleSection from './TitleSection'
import { CreateNote } from './Modal'

function NoteSection({className = ''}) {
  const [showPopUp, setShowPopUp] = useState(false);
  const [notes, setNotes] = useState([]);

  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  }

  const handleSaveNote = (newNote) => {
    setNotes([...notes, newNote]);
    togglePopUp(false);
  }

  return (
    <div id='note-div' className={'flex flex-col p-4 bg-white rounded-2xl overflow-y-hidden h-full shadow-sm'}>
      <TitleSection title='Notes' buttonText='Add Note' buttonOnClick={togglePopUp}/>
      {showPopUp && <CreateNote closeModal={togglePopUp} onSave={handleSaveNote} />}

      <section className={`grid grid-cols-2 sm:grid-cols-1 xl:grid-cols-2 gap-2 w-full bg-white pr-2 rounded-xl overflow-y-auto ${className}`}>
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
  )
}

export default NoteSection