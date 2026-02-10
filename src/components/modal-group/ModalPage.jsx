import { useFetchTaskData } from "../../services/FetchData";
import ModalOverlay from "../ModalOverlay";
import { IconTitleSection } from "../TitleSection";


function DashBoard({ closeModal }) {
  const { taskData, loading } = useFetchTaskData();

  const todoN = taskData ? taskData.filter(task => task.status === 'To-do').length : 0;
  const progressN = taskData ? taskData.filter(task => task.status === 'In-rrogress').length : 0;
  const reviewN = taskData ? taskData.filter(task => task.status === 'To-review').length : 0;
  const finishedN = taskData ? taskData.filter(task => task.status === 'Finished').length : 0;

  return (
    <ModalOverlay>
      <div className="bg-white flex flex-col p-4 w-full max-w-screen-2xl h-[90vh] rounded-md shadow-2xl">
        <IconTitleSection title="Project Analytics" iconOnClick={closeModal} dataFeather="x" />
        
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="animate-pulse">Loading Dashboard...</p>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Stat Card: To-do */}
            <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded shadow-sm">
              <span className="text-gray-500 font-medium uppercase text-xs">To-do</span>
              <p className="text-3xl font-bold">{todoN}</p>
            </div>

            {/* Stat Card: In Progress */}
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded shadow-sm">
              <span className="text-green-600 font-medium uppercase text-xs">In Progress</span>
              <p className="text-3xl font-bold">{progressN}</p>
            </div>

            {/* Stat Card: To Review */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow-sm">
              <span className="text-blue-600 font-medium uppercase text-xs">To Review</span>
              <p className="text-3xl font-bold">{reviewN}</p>
            </div>

            {/* Stat Card: Finished */}
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded shadow-sm">
              <span className="text-purple-600 font-medium uppercase text-xs">Finished</span>
              <p className="text-3xl font-bold">{finishedN}</p>
            </div>
          </div>
        )}
      </div>
    </ModalOverlay>
  );
}


export { DashBoard };
