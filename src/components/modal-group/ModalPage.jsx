import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { useFetchProjectHistory, useFetchTaskData } from "../../services/FetchData";
import { SummaryCard } from "../Cards";
import ModalOverlay from "../ModalOverlay";
import { IconTitleSection } from "../TitleSection";


export default function DashBoard({ closeModal }) {
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
  ];

  const { history, loading: loadingHistory } = useFetchProjectHistory(projectId);

  return (
    <ModalOverlay onClick={closeModal}>
      <div className="absolute bg-zinc-100 flex flex-col p-2 max-w-screen-2xl w-full h-[95vh] rounded-md shadow-2xl overflow-hidden">
        <IconTitleSection title="Dashboard" iconOnClick={closeModal} dataFeather="x" />

        {loading ? (
          <div className="flex justify-center items-center flex-1 min-h-0">
            <p className="animate-pulse">Loading Dashboard...</p>
          </div>
        ) : (
          <div className="flex gap-2 flex-1 min-h-0">
            {/* Left Column */}
            <div className="flex flex-col gap-2 max-w-[30rem] w-full flex-1 min-h-0">
              {/* Tasks Summary */}
              <SummaryCard
                description="Here's the summary for this project"
                items={tasksSummary}
                title="Tasks Summary"
              />

              {/* Project History */}
              <div className="flex flex-col bg-white p-2 border rounded-md flex-1 min-h-0">
                <IconTitleSection title="Project History" />
                <div className="flex flex-col gap-2 overflow-auto flex-1 min-h-0">
                  {loadingHistory ? (
                    <BarLoader />
                  ) : history.length > 0 ? (
                    history.map(item => (
                      <div
                        key={item.id}
                        className="border p-2 rounded-md text-sm flex justify-between"
                      >
                        <p className="font-semibold">
                          {item.username} {item.action.toLowerCase()}
                        </p>
                        {item.createdAt.toDate().toLocaleString()}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">No history yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column (Analytics) */}
            <div className="flex flex-col bg-white p-4 w-full rounded-md border flex-1 min-h-0">
              <IconTitleSection title="Analytics" />
              <div className="flex-1 min-h-0 overflow-auto">
                <p className="text-gray-500 text-sm">Analytics content goes here.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModalOverlay>
  );
}



