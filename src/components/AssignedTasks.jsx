import React from 'react';
import { ProgressAlertCard } from './ProgressCard';
import { DisplayTitleSection } from './TitleSection';

function AssignedTasks() {
  
  return (
    <div className="flex flex-col bg-white p-4 rounded-2xl w-full max-h-full h-full shadow-sm overflow-hidden">
      <DisplayTitleSection
        title="Assigned Tasks"
        displayCount='0'
      />

      <section className="grid grid-cols-1 gap-2 w-full h-full pr-2 overflow-y-auto">
        <ProgressAlertCard />
        <ProgressAlertCard />
        <ProgressAlertCard />
        <ProgressAlertCard />
        <ProgressAlertCard />
      </section>
    </div>
  );
}

export default AssignedTasks;
