import { useState } from 'react';
import { BarLoader } from 'react-spinners';
import { useReloadContext } from '../context/ReloadContext';
import { useSort } from '../context/SortContext';
import { useFetchNoteData, useFetchProjectData } from '../services/FetchData';
import { CreateCard, NoteCard, ProjectCard } from './Cards';
import CreateNote from './modal-group/create-modals/CreateNote';
import CreateProject from './modal-group/create-modals/CreateProject';
import { FilterPopup } from './modal-group/Popup';
import { ReloadIcon } from './ReloadComponent';
import { IconTitleSection } from './TitleSection';

export function MainProjectSection() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const { key } = useReloadContext();
  const { sortState } = useSort();

  const activeSort = Object.entries(sortState).find(([, v]) => v);
  const orderValue = activeSort?.[0] ?? null;
  const orderPos = activeSort?.[1] ?? 'asc';

  const { projectData, loading } = useFetchProjectData(key, orderValue, orderPos);

  return (
    <div className="flex flex-col w-full h-full bg-white rounded-2xl border shadow-md overflow-hidden">
      <header className="relative border-b p-4 pb-0">
        <IconTitleSection
          title="Projects"
          dataFeather="filter"
          iconOnClick={() => setShowFilter(p => !p)}
          extraIcon={<ReloadIcon />}
          titleClassName="text-lg font-merriweather"
          className="bg-transparent border-0 shadow-none px-1"
        />
        {showFilter && <FilterPopup closeModal={() => setShowFilter(false)} />}
      </header>

      {loading && <BarLoader color="#228B22" width="100%" height={3} />}

      <div className="overflow-y-auto flex-1">
        <section id="project-container" className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 p-4">
          <CreateCard onClick={() => setShowPopUp(true)} title="Create Project" description="Get started! Manage tasks individually or collaboratively." />
          {showPopUp && <CreateProject closeModal={() => setShowPopUp(false)} />}

          {!loading && (projectData?.length > 0
            ? projectData.map(project => <ProjectCard key={project.id} projectData={project} />)
            : <div className="col-span-full flex flex-col items-center justify-center py-12 gap-2">
                <div className="w-10 h-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                  <span className="text-green-300 text-xl font-light">∅</span>
                </div>
                <p className="text-sm text-gray-400">No projects yet</p>
              </div>
          )}
        </section>
      </div>
    </div>
  );
}

export function MainNotesSection() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const { key } = useReloadContext();

  const { noteData, loading } = useFetchNoteData(key);

  return (
    <div className="flex flex-col w-full h-full bg-white rounded-2xl border shadow-md overflow-hidden">
      <header className="border-b p-4 pb-0 relative">
        <IconTitleSection
          title="Project Notes"
          dataFeather="filter"
          iconOnClick={() => setShowFilter(p => !p)}
          extraIcon={<ReloadIcon />}
          titleClassName="text-lg font-merriweather"
          className="bg-transparent border-0 shadow-none px-1"
        />
        {showFilter && <FilterPopup closeModal={() => setShowFilter(false)} />}
      </header>
      

      {loading && <BarLoader color="#228B22" width="100%" height={3} />}

      <div className="overflow-y-auto flex-1">
        <section id="note-container" className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 p-4">
          <CreateCard onClick={() => setShowPopUp(true)} title="Create Note" description="Write a personal note." />
          {showPopUp && <CreateNote closeModal={() => setShowPopUp(false)} />}

          {!loading && (noteData?.length > 0
            ? noteData.map((note, i) => <NoteCard key={`${note.id}-${i}`} noteData={note} />)
            : <div className="col-span-full flex flex-col items-center justify-center py-12 gap-2">
                <div className="w-10 h-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                  <span className="text-green-300 text-xl font-light">∅</span>
                </div>
                <p className="text-sm text-gray-400">No notes yet</p>
              </div>
          )}
        </section>
      </div>
    </div>
  );
}