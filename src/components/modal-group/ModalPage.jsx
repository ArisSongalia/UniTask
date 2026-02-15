import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { useFetchProjectHistory, useFetchTaskData } from "../../services/FetchData";
import { SummaryCard } from "../Cards";
import ModalOverlay from "../ModalOverlay";
import { IconTitleSection } from "../TitleSection";
import { IconText } from "../Icon";


function DashBoard({ closeModal }) {
  const { taskData, loading } = useFetchTaskData();
  const { projectId } = useParams();

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

  const { history, loading: loadingHistory } = useFetchProjectHistory(projectId);

  return (
    <ModalOverlay>  
      <div className="bg-zinc-100 flex flex-col p-2 w-full max-w-screen-2xl h-full rounded-md shadow-2xl overflow-hidden">
        <IconTitleSection title="Project Analytics" iconOnClick={closeModal} dataFeather="x" />
        
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="animate-pulse">Loading Dashboard...</p>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="flex flex-col h-full max-w-[30rem] w-full gap-2">
              <SummaryCard description="Heres the summary for this project" items={tasksSummary} title="Tasks Summary" />
              {/* Project History */}
              <div className="flex flex-col bg-white flex-1 p-2 border rounded-md ">
                <IconTitleSection title="Project History" dataFeather="refresh-cw" />
                <div className="flex flex-col gap-2 h-full">
                  {loadingHistory ? (
                      <BarLoader />
                    ) : history.length > 0 ? (
                      history.map(item => (
                        <div key={item.id} className="border p-2 rounded-md text-sm">
                          <span className="flex items-center justify-between">
                            <p className="font-semibold">{item.action}</p>
                            <IconText text={item.actionType} />
                          </span>
                          <p className="text-xs text-gray-500">{item.username}</p>
                        </div>
                      ))
                    ) : (
                    <p className="text-sm text-gray-400">No history yet</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex bg-white p-4 w-full max-h-full rounded-md border">
              <IconTitleSection title="Analytics" />
            </div>
          </div>
        )}

      </div>
    </ModalOverlay>
  );
}


export { DashBoard };

