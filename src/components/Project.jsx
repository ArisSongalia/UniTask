import { useState } from 'react';
import ProgressBoard from './ProgressBoard';
import NoteSection from './NoteSection';
import TaskNavBar from './TaskNavBar';
import { MultiTitleSection } from './TitleSection';
import { DashBoard } from './modal-group/ModalPage';


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
    {
      label: 'Dashboard',
      onClick: () => setActiveSection('dashboard'),
      isActive: activeSection === 'dashboard',
      dataFeather: 'pie-chart'
    },
  ]
  return (
    <div className="flex flex-col h-screen w-full items-center">
      <TaskNavBar />

      <div className="flex flex-col flex-1 min-h-0 w-full p-4 max-w-screen-2xl bg-white shadow-md rounded-md my-2">
        <MultiTitleSection titles={titles} className='' />
          {activeSection === 'progressBoard' && <ProgressBoard/>}
          {activeSection === 'notes' && <NoteSection />}
          {activeSection === 'dashboard' && <DashBoard />}
      </div>
    </div>
  )
}

export default Project