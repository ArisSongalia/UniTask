import ProgressBoard from './ProgressBoard';
import TaskSideBar from '../components/TaskSideBar';
import TaskNavBar from './TaskNavBar';


function Project() {
  return (
    <div className="flex flex-col h-screen w-full items-center overflow-hidden">
      <TaskNavBar />

      <div className="flex flex-1 min-h-0 w-full gap-2 max-w-screen-2xl justify-center p-2">
        <ProgressBoard />
        <TaskSideBar className="hidden lg:flex flex-col w-[35%] max-w-[35%]" />
      </div>
    </div>
  )
}

export default Project