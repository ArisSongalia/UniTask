import ProgressBoard from './ProgressBoard';
import TaskSideBar from '../components/TaskSideBar';
import TaskNavBar from './TaskNavBar';


function Project() {
  return (
    <div className='flex flex-col w-full h-[100vh] items-center overflow-auto'>
      <TaskNavBar />
      <div className='flex w-full p-4 h-[calc(100vh-4rem)] gap-4 max-w-screen-2xl justify-center'>
        <ProgressBoard />
        <TaskSideBar className='hidden lg:flex max-w-[35%]'/>
      </div>
    </div>
  )
}

export default Project