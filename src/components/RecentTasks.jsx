import React, { useState } from 'react';
import { MultiTitleSection } from './TitleSection';
import { MainNotesSection, MainProjectSection } from './MainSections';

function RecentTasks() {
  const [activeSection, setActiveSection] = useState('project');
  const titles = [
    {
      label: 'Pending Projects',
      onClick: () => setActiveSection('project'),
      isActive: activeSection === 'project',
      dataFeather: 'briefcase'
    },
    {
      label: 'Action Notes',
      onClick: () => setActiveSection('notes'),
      isActive: activeSection === 'notes',
      dataFeather: 'file-text'
    },
  ];

  return (
    <section className="flex flex-col flex-grow w-full bg-white p-4 h-full rounded-md shadow-md">
      <MultiTitleSection
        titles={titles}
      />
      <div className="w-full overflow-y-scroll pr-2">
        {activeSection === 'project' && <MainProjectSection />}
        {activeSection === 'notes' && <MainNotesSection />}
      </div>
    </section>
  );
}

export default RecentTasks;
