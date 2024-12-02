import React, { useState } from 'react';
import { MultiTitleSection } from './TitleSection';
import { MainNotesSection, MainProjectSection } from './MainSections';

function RecentTasks() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [activeSection, setActiveSection] = useState('project');


  const titles = [
    {
      label: 'Recent Tasks',
      onClick: () => setActiveSection('project'),
      isActive: activeSection === 'project',
    },
    {
      label: 'Notes',
      onClick: () => setActiveSection('notes'),
      isActive: activeSection === 'notes',
    },
  ];

  return (
    <section className="flex flex-col flex-grow w-full bg-white p-4 h-auto rounded-2xl shadow-sm">
      <MultiTitleSection
        titles={titles}
        dataFeather="filter"
        onTitleClick={setActiveSection}
      />
      <div className="w-full">
        {activeSection === 'project' && <MainProjectSection />}
        {activeSection === 'notes' && <MainNotesSection />}
      </div>
    </section>
  );
}

export default RecentTasks;
