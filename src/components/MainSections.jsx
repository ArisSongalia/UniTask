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

// ─── Shared section wrapper ───────────────────────────────────────────────────

function SectionShell({ children }) {
  return (
    <div className="flex flex-col w-full h-full bg-white rounded-2xl border shadow-md overflow-hidden">
      {children}
    </div>
  );
}


// ─── Count badge ─────────────────────────────────────────────────────────────

function CountBadge({ count }) {
  if (!count && count !== 0) return null;
  return (
    <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-700 border border-green-200">
      {count}
    </span>
  );
}

// ─── Loading row ─────────────────────────────────────────────────────────────

function LoadingRow() {
  return (
    <div className="col-span-full flex items-center justify-start px-1 py-2">
      <BarLoader color="#228B22" width={120} height={3} />
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState({ label }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
      <div className="w-10 h-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
        <span className="text-green-300 text-xl font-light">∅</span>
      </div>
      <p className="text-sm text-gray-400">No {label} yet</p>
    </div>
  );
}

// ─── Section grid ─────────────────────────────────────────────────────────────

function SectionGrid({ id, children }) {
  return (
    <section
      id={id}
      className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 p-4"
    >
      {children}
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function MainProjectSection() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const { key } = useReloadContext();
  const { sortState } = useSort();

  const activeSort = Object.entries(sortState).find(([, value]) => value);
  const orderValue = activeSort ? activeSort[0] : null;
  const orderPos = activeSort ? activeSort[1] : "asc";

  const togglePopUp = () => setShowPopUp((p) => !p);
  const toggleShowFilter = () => setShowFilter((p) => !p);

  const { projectData, loading } = useFetchProjectData(key, orderValue, orderPos);

  return (
    <SectionShell>
      <header className='relative border-b p-4 pb-0'>
        <IconTitleSection
          title="Projects"
          dataFeather="filter"
          iconOnClick={toggleShowFilter}
          extraIcon={<ReloadIcon />}
          titleClassName="text-lg font-merriweather"
          className="bg-transparent border-0 shadow-none px-0 "
        />

        {showFilter && (
          <div className="px-4 pb-3">
            <FilterPopup closeModal={toggleShowFilter} />
          </div>
        )}
      </header>

      <div className="overflow-y-auto flex-1">
        <SectionGrid id="project-container">
          <CreateCard
            onClick={togglePopUp}
            title="Create Project"
            description="Get started! Manage tasks individually or collaboratively."
          />
          {showPopUp && <CreateProject closeModal={togglePopUp} />}

          {loading ? (
            <LoadingRow />
          ) : projectData?.length > 0 ? (
            projectData.map((project) => (
              <ProjectCard key={project.id} projectData={project} />
            ))
          ) : (
            <EmptyState label="projects" />
          )}
        </SectionGrid>
      </div>
    </SectionShell>
  );
}

// ─── Notes ────────────────────────────────────────────────────────────────────

function MainNotesSection() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const { key } = useReloadContext();

  const togglePopUp = () => setShowPopUp((p) => !p);
  const toggleShowFilter = () => setShowFilter((p) => !p);

  const { noteData, loading } = useFetchNoteData(key);

  return (
    <SectionShell>
      <div className="flex items-center p-4 pb-0 border-b">
          <IconTitleSection
            title="Notes"
            dataFeather="filter"
            extraIcon={<ReloadIcon />}
            titleClassName="text-lg font-merriweather"
            className="bg-transparent border-0 shadow-none px-0"
            iconOnClick={toggleShowFilter}
          />
        </div>
        {showFilter && (
          <div className="px-4 pb-3">
            <FilterPopup closeModal={toggleShowFilter} />
          </div>
        )}

      <div className="overflow-y-auto flex-1">
        <SectionGrid id="note-container">
          <CreateCard
            onClick={togglePopUp}
            title="Create Note"
            description="Write a personal note."
            titleClassName="text-lg font-merriweather"
          />
          {showPopUp && <CreateNote closeModal={togglePopUp} />}

          {loading ? (
            <LoadingRow />
          ) : noteData?.length > 0 ? (
            noteData.map((note, index) => (
              <NoteCard key={`${note.id}-${index}`} noteData={note} />
            ))
          ) : (
            <EmptyState label="notes" />
          )}
        </SectionGrid>
      </div>
    </SectionShell>
  );
}

export { MainNotesSection, MainProjectSection };