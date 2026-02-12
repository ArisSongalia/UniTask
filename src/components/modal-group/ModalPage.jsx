import { useFetchTaskData } from "../../services/FetchData";
import { SummaryCard } from "../Cards";
import ModalOverlay from "../ModalOverlay";
import TitleSection, { IconTitleSection } from "../TitleSection";


function DashBoard({ closeModal }) {
  const { taskData, loading } = useFetchTaskData();

  const todoN = taskData ? taskData.filter(task => task.status === 'To-do').length : 0;
  const progressN = taskData ? taskData.filter(task => task.status === 'In-progress').length : 0;
  const reviewN = taskData ? taskData.filter(task => task.status === 'To-review').length : 0;
  const finishedN = taskData ? taskData.filter(task => task.status === 'Finished').length : 0;

  const tasksSummary = [
    { count: todoN, label: 'To-do'},
    { count: progressN, label: 'In-progress'},
    { count: reviewN, label: 'Review'},
    { count: finishedN, label: 'Finished'},
  ]

  return (
    <ModalOverlay>
      <div className="bg-zinc-100 flex flex-col p-2 w-full max-w-screen-2xl h-[90vh] rounded-md shadow-2xl">
        <IconTitleSection title="Project Analytics" iconOnClick={closeModal} dataFeather="x" />
        
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="animate-pulse">Loading Dashboard...</p>
          </div>
        ) : (

          <div className="bg-white flex flex-col h-full w-[30rem] p-4 gap-2">
            

            <SummaryCard description="Heres the summary for this project" items={tasksSummary} title="Tasks Summary" />

            <div className="flex flex-1 p-2 border rounded-md">
              <IconTitleSection title="Project History" dataFeather="refresh-cw"/>
            </div>  
          </div>
        )}


      </div>
    </ModalOverlay>
  );
}


export { DashBoard };
