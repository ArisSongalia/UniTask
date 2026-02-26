import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useFetchActiveProjectData, useFetchAnalytics, useFetchTaskData } from "../../services/FetchData";
import { SummaryCard } from "../Cards";
import { IconText } from "../Icon";
import TitleSection from "../TitleSection";
import { TaskFocus } from "./SharedModals";


function DashBoard() {
  const { projectId } = useParams();
  const { taskData, loading: tasksLoading } = useFetchTaskData();
  const { eventsData = [], metricsData = {} } = useFetchAnalytics(projectId);
  const [mostActiveUser, setMostActiveUser] = useState(null);
  const COLORS = ['#71717a', '#2563eb', '#ca8a04', '#166534'];

  const { counts, chartData } = useMemo(() => {
    const todo = taskData?.filter(t => t.status === 'To-do').length || 0;
    const progress = taskData?.filter(t => t.status === 'In-progress').length || 0;
    const review = taskData?.filter(t => t.status === 'To-review').length || 0;
    const finished = taskData?.filter(t => t.status === 'Finished').length || 0;

    return {
      counts: { todo, progress, review, finished },
      chartData: [
        { name: "To-do", tasks: todo },
        { name: "Progress", tasks: progress },
        { name: "Review", tasks: review },
        { name: "Finished", tasks: finished },
      ]
    };
  }, [taskData]);

  // --- 2. Time Calculations ---
  const displayAvgTime = useMemo(() => {
    const total = metricsData?.totalCompletionTime || 0;
    const completed = metricsData?.tasksCompleted || 0;
    if (completed === 0) return "0m";

    const avgMs = total / completed;
    const h = Math.floor(avgMs / 3600000);
    const m = Math.floor((avgMs % 3600000) / 60000);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }, [metricsData]);

  // --- 3. Summary Array ---
  const tasksSummary = [
    { count: displayAvgTime, label: 'AVG Task Completion Time', customClass: 'col-span-2'},
    { count: counts.todo, label: 'To-do' },
    { count: counts.progress, label: 'In-progress' },
    { count: counts.review, label: 'Review' },
    { count: counts.finished, label: 'Finished' },
    { count: metricsData?.projectActivity || 0, label: 'Activity' },
    { count: metricsData?.urgentTasks || 0, label: 'Urgent' },
  ];

  // --- 4. Most Active User Logic ---
  useEffect(() => {
    const users = metricsData?.userActivity;
    if (!users || users.length === 0) return;

    const hashmap = users.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});

    const winner = Object.keys(hashmap).reduce((a, b) => 
      hashmap[a] > hashmap[b] ? a : b
    );

    setMostActiveUser(winner);
  }, [metricsData]);

  return (
      <div className="flex flex-col w-full h-full rounded-md overflow-hidden">
        <TitleSection title="Dashboard" />

        {tasksLoading ? (
          <BarLoader />
        ) : (
          <div className="bg-zinc-100 p-4 flex flex-col h-full gap-4 overflow-y-auto">
            {/* Top Section: Charts & Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <SummaryCard
                title="Metrics Overview"
                description="Real-time project statistics"
                items={tasksSummary}
                className="h-full"
              />

              <div className="bg-white p-4 rounded-md border shadow-sm h-full">
                <TitleSection title="Task Distribution" />
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      isAnimationActive={false}
                      dataKey="tasks"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60} 
                      outerRadius={80}
                      paddingAngle={5}
                      label
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom Section: History */}
            <div className="bg-white p-4 border rounded-md shadow-sm flex flex-col h-full">
              <TitleSection title="Recent Activity" />
              <div className="flex flex-col gap-2 mt-2">
                {eventsData.length > 0 ? (
                  eventsData.map((item) => (
                    <div key={item.id} className="border-b pb-2 last:border-0 flex justify-between items-center text-sm">
                      <div className="flex gap-2">
                        <div className="flex gap-2">
                          {item.team?.map(m => <IconText key={m.uid} text={m.username} />) || "System"}
                        </div>
                        <span className="font-medium text-zinc-600 capitalize">{item.event}</span>
                      </div>
                      <span className="text-zinc-400">
                        {item.timestamp?.toDate().toLocaleString() || "Just now"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-zinc-400">No recent activity found.</p>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
  );
}

function Timeline() {
  const [days, setDays] = useState([]);
  const { projectId } = useParams();
  const [showTaskFocus, setShowTaskFocus] = useState(false);

  const toggleShowTaskFocus = () => {
    setShowTaskFocus(!showTaskFocus)
  };

  const generateDays = (startDate, numberOfDays) => {
    return Array.from({ length: numberOfDays }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return date;
    });
  };

  const { projectData } = useFetchActiveProjectData(projectId);
    useEffect(() => {
      if (projectData?.createdAt && projectData?.targetDate) {
        const start = projectData.createdAt.toDate();
        const end = projectData.targetDate.toDate();

        // Remove time portion
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        // Include last day (+1 because range is inclusive)
        const diffDays =
          (end - start) / (1000 * 60 * 60 * 24) + 1;

        setDays(generateDays(start, diffDays));
      }
    }, [projectData]);
  const { taskData } = useFetchTaskData(projectId);

  const compareDate = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate())
  }

  return (
    <div className="flex flex-1 flex-col bg-white overflow-hidden">
      <TitleSection title="Timeline" />
      <div className="flex flex-1 bg-zinc-100 overflow-x-scroll">
        {days.map((day, i) => {
          const showMonth = i === 0 || day.getMonth() !== days[i - 1].getMonth();

          return (
            <div
              key={i}
              className="flex flex-col items-start gap-1 min-w-[60px] border-r flex-shrink-0 border-gray-200"
            >
              {/* Dates */}
              <div className="flex w-full items-center flex-col">
                {/* Month Header (only when month changes) */}
                {showMonth && (
                  <div className=" w-full text-center bg-gray-100 border-b border-gray-300 py-1">
                    <span className="text-xs font-semibold tracking-wide text-gray-700">
                      {day.toLocaleString("en-US", { month: "long" })}
                    </span>
                  </div>
                )}
                <span className={`font-medium text-sm border-b-2 w-full text-center text-gray-700 ${!showMonth && 'pt-[2.10rem]'}`}>
                  {day.getDate()}
                </span>
              </div>

              {/* Tasks*/}
              {taskData
                .filter(data => compareDate(new Date(data.deadline.toDate()), day))
                .map(task => (
                  <div className="l">
                    <IconText 
                      key={task.id}
                      text={task.title} 
                      className="max-w-[12rem] break-words whitespace-normal hover:bg-green-100 hover:cursor-pointer" 
                      border 
                      onClick={toggleShowTaskFocus}
                    />
                    {showTaskFocus && <TaskFocus key={task.id} taskData ={task} closeModal={toggleShowTaskFocus} />}
                  </div>
                ))
       
              }

            </div>
          );
        })}
      </div>
    </div>
  )
}

export { DashBoard, Timeline };

