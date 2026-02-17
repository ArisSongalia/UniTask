import { where } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { useFetchNoteData, useFetchProjectData, useFetchTaskData } from '../services/FetchData';
import AssignedTasks from './AssignedTasks';
import { SummaryCard } from './Cards';
import { Summary } from './modal-group/Modal';
import { IconTitleSection } from './TitleSection';


function HomeSideBar({ className = '', closeModal = () => {} }) {
  const user = auth.currentUser;
  const [customWhere, setCustomWhere] = useState(null);
  
  useEffect(() => {
    if (user?.uid) {
      setCustomWhere([
        where("team-uids", "array-contains", user?.uid),
        where("status", "!=", "Finished")
      ]);
    }
  }, [user]);

  const { taskData } = useFetchTaskData(customWhere);
  const { projectData } = useFetchProjectData(); 

  
  const tasks = taskData ? taskData.filter(tasks => tasks.completedAt === null).length : 0;
  const urgent = taskData ? taskData.filter(tasks => tasks.priority === 'Urgent').length : 0;
  const review = taskData ? taskData.filter(tasks => tasks.status === 'To-review').length : 0;
  const project = projectData ? projectData.length : 0;

  const summaryItems = [
    { count: project, label: 'Project' },
    { count: tasks, label: 'Ongoing' },
    { count: urgent, label: 'Urgent' },
    { count: review, label: 'Review' }
  ];

  return (
    <div id="header" className={`flex w-full lg:w-[35rem] h-full gap-2 flex-col bg-gray-100 ${className}`}>
      <IconTitleSection 
        title='Data' 
        dataFeather='x' 
        iconOnClick={closeModal}
        className='p-4 pb-2 bg-white lg:hidden' 
        titleClassName='text-md font-bold' 
      />
      
      <SummaryCard 
        title="Daily Summary"
        description={`Hi ${user?.displayName || 'User'}, here is your overview.`}
        items={summaryItems}
        SummaryContent={<Summary />}
        button
      />

      <AssignedTasks />
    </div>
  )
}

export default HomeSideBar