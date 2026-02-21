import { useState } from 'react';
import ProgressBoard from './ProgressBoard';
import NoteSection from './NoteSection';
import TaskNavBar from './TaskNavBar';
import { MultiTitleSection } from './TitleSection';


function Project() {
  const [activeSection, setActiveSection] = useState('progressBoard');
  const titles = [
    {
      label: 'Progress Board',
      onClick: () => setActiveSection('progressBoard'),
      isActive: activeSection === 'progressBoard',
      dataFeather: 'table'
    },
    {
      label: 'Project Notes',
      onClick: () => setActiveSection('notes'),
      isActive: activeSection === 'notes',
      dataFeather: 'file-text'
    },
  ]
  return (
    <div className="flex flex-col h-screen w-full items-center">
      <TaskNavBar />

      <div className="flex flex-col flex-1 min-h-0 w-full max-w-screen-2xl p-4 bg-white shadow-md rounded-md my-2">
        <MultiTitleSection titles={titles} />
          {activeSection === 'progressBoard' && <ProgressBoard/>}
          {activeSection === 'notes' && <NoteSection />}
      </div>
    </div>
  )
}

export default Project