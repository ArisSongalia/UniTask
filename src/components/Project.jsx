import { useState } from 'react';
import DashBoard from './modal-group/page-modals/Dashboard';
import NoteSection from './modal-group/page-modals/NoteSection';
import ProgressBoard from './modal-group/page-modals/ProgressBoard';
import Timeline from './modal-group/page-modals/Timeline';
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
    {
      label: 'Timeline',
      onClick: () => setActiveSection('timeline'),
      isActive: activeSection === 'timeline',
      dataFeather: 'calendar'
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
          {activeSection === 'timeline' && <Timeline />}
          {activeSection === 'dashboard' && <DashBoard />}
      </div>
    </div>
  )
}

export default Project