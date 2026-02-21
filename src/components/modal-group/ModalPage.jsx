import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useFetchAnalytics, useFetchTaskData, UseFetchUserData } from "../../services/FetchData";
import { SummaryCard } from "../Cards";
import { IconText } from "../Icon";
import ModalOverlay from "../ModalOverlay";
import TitleSection, { IconTitleSection } from "../TitleSection";


function DashBoard({ closeModal }) {
  const { projectId } = useParams();
  const { taskData, loading: tasksLoading } = useFetchTaskData();
  const { eventsData = [], metricsData = {} } = useFetchAnalytics(projectId);
  const [mostActiveUser, setMostActiveUser] = useState(null);
  const { userData } = UseFetchUserData(mostActiveUser);
  const COLORS = ['#71717a', '#2563eb', '#ca8a04', '#166534'];

  // --- 1. Memoized Task Counts ---
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
    <ModalOverlay onClick={closeModal}>
      <div className="absolute bg-zinc-100 flex flex-col p-4 max-w-screen-lg w-full h-[90vh] rounded-md shadow-2xl overflow-hidden">
        <IconTitleSection title="Project Dashboard" iconOnClick={closeModal} dataFeather="x" />

        {tasksLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="animate-pulse text-zinc-500">Loading analytics...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 overflow-y-auto pr-2">
            
            {/* Top Section: Charts & Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SummaryCard
                title="Metrics Overview"
                description="Real-time project statistics"
                items={tasksSummary}
                className="h-full"
              />

              <div className="bg-white p-4 rounded-md border shadow-sm">
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
            <div className="bg-white p-4 border rounded-md shadow-sm flex flex-col">
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
    </ModalOverlay>
  );
}

export { DashBoard };
