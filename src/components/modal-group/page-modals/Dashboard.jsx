import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { useFetchAnalytics, useFetchTaskData } from "../../../services/FetchData";
import Icon from "../../Icon";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS = [
  { key: "todo",     label: "To-do",       color: "#6b7280", filter: "To-do"        },
  { key: "progress", label: "In-progress", color: "#2563eb", filter: "In-progress"  },
  { key: "review",   label: "To-review",   color: "#d97706", filter: "To-review"    },
  { key: "finished", label: "Finished",    color: "#166534", filter: "Finished"     },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useDashboardData(projectId) {
  const { taskData, loading } = useFetchTaskData();
  const { eventsData = [], metricsData = {} } = useFetchAnalytics(projectId);
  const [mostActiveUser, setMostActiveUser] = useState(null);

  const counts = useMemo(() => {
    if (!taskData) return { todo: 0, progress: 0, review: 0, finished: 0 };
    return {
      todo:     taskData.filter(t => t.status === "To-do").length,
      progress: taskData.filter(t => t.status === "In-progress").length,
      review:   taskData.filter(t => t.status === "To-review").length,
      finished: taskData.filter(t => t.status === "Finished").length,
    };
  }, [taskData]);

  const total = counts.todo + counts.progress + counts.review + counts.finished;
  const completionPct = total > 0 ? Math.round((counts.finished / total) * 100) : 0;

  const avgTime = useMemo(() => {
    const { totalCompletionTime = 0, tasksCompleted = 0 } = metricsData;
    if (!tasksCompleted) return "—";
    const avgMs = totalCompletionTime / tasksCompleted;
    const h = Math.floor(avgMs / 3600000);
    const m = Math.floor((avgMs % 3600000) / 60000);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }, [metricsData]);

  const sparkData = useMemo(() => [
    { v: counts.todo },
    { v: Math.round((counts.todo + counts.progress) / 2) },
    { v: counts.progress },
    { v: Math.round((counts.progress + counts.review) / 2) },
    { v: counts.review },
    { v: Math.round((counts.review + counts.finished) / 2) },
    { v: counts.finished },
  ], [counts]);

  useEffect(() => {
    if (!eventsData?.length) return;
    const freq = {};
    eventsData.forEach(e => {
      e.team?.forEach(m => {
        freq[m.username] = (freq[m.username] || 0) + 1;
      });
    });
    if (Object.keys(freq).length) {
      setMostActiveUser(Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b));
    }
  }, [eventsData]);

  return { counts, total, completionPct, avgTime, sparkData, eventsData, metricsData, mostActiveUser, loading };
}

// ─── Small reusable card wrapper ─────────────────────────────────────────────

function Card({ title, subtitle, children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
      {(title || subtitle) && (
        <div className="flex justify-between px-5 pt-4 pb-3 border-b border-gray-100 items-center">
          {title  && <p className="text-sm font-bold text-gray-800">{title}</p>}
          {subtitle && <p className="text-xs text-gray-600 font-semibold">{subtitle}</p>}
        </div>
      )}
      <div className="px-5 py-3">{children}</div>
    </div>
  );
}

// ─── Section components ───────────────────────────────────────────────────────

function MetricsCard({ avgTime, metricsData }) {
  const groups = [
    {
      heading: "Overview",
      rows: [
        { label: "Avg Completion",  value: avgTime,                              accent: false },
        { label: "Activity Events", value: metricsData?.projectActivity || 0,    accent: false },
        { label: "Total Tasks",     value: metricsData?.totalTasks      || 0,    accent: false },
        { label: "Tasks Completed", value: metricsData?.tasksCompleted  || 0,    accent: false },
      ],
    },
    {
      heading: "Priority",
      rows: [
        { label: "High",   value: metricsData?.highPriorityTasks   || 0, accent: true  },
        { label: "Medium", value: metricsData?.mediumPriorityTasks || 0, accent: false },
        { label: "Low",    value: metricsData?.lowPriorityTasks    || 0, accent: false },
      ],
    },
    {
      heading: "Progress",
      rows: [
        { label: "Started",   value: metricsData?.tasksStarted  || 0, accent: false },
        { label: "In Review", value: metricsData?.tasksInReview || 0, accent: false },
        { label: "Urgent",    value: metricsData?.urgentTasks   || 0, accent: true  },
      ],
    },
    {
      heading: "Deadlines",
      rows: [
        { label: "On Time",  value: metricsData?.tasksOnTime  || 0, accent: false },
        { label: "Late",     value: metricsData?.tasksLate    || 0, accent: true  },
        { label: "Overdue",  value: metricsData?.overdueTasks || 0, accent: true  },
        { label: "Due Soon", value: metricsData?.dueSoonTasks || 0, accent: true  },
      ],
    },
  ];

  return (
    <Card title="Metrics" subtitle="Project statistics">
      {groups.map(({ heading, rows }, i) => (
        <div key={heading} className={i !== 0 ? "mt-4 pt-4 border-t border-gray-100" : ""}>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{heading}</p>
          {rows.map(({ label, value, accent }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">{label}</span>
              <span className={`text-sm font-bold ${accent ? "text-red-600" : "text-gray-900"}`}>{value}</span>
            </div>
          ))}
        </div>
      ))}
    </Card>
  );
}

// ActivityFeed: fills remaining column height, inner list scrolls
function ActivityFeed({ eventsData }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
      <div className="flex justify-between px-5 pt-4 pb-3 border-b border-gray-100 items-center flex-shrink-0">
        <p className="text-sm font-bold text-gray-800">Recent Activity</p>
        <p className="text-xs text-gray-600 font-semibold">
          {eventsData.length ? `${eventsData.length} events` : "No activity yet"}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-3">
        {eventsData.length > 0 ? eventsData.map(item => {
          const ts       = item.timestamp?.toDate();
          const dateStr  = ts ? ts.toLocaleDateString("en-US", { day: "2-digit", month: "short" }) : "—";
          const timeStr  = ts ? ts.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "Just now";
          const initials = item.team?.[0]?.username?.[0]?.toUpperCase() ?? "S";
          const names    = item.team?.map(m => m.username).join(", ") || "System";
          return (
            <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <div className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-white">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{names}</p>
                <p className="text-xs text-gray-400 capitalize truncate">{item.event}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-medium text-gray-600">{dateStr}</p>
                <p className="text-xs text-gray-400">{timeStr}</p>
              </div>
            </div>
          );
        }) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-300">
            <Icon dataFeather="clock" className="w-8 h-8 p-1" />
            <p className="text-sm text-gray-400">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
}

// TotalsHero: explicit pixel height so ResponsiveContainer has a sized parent
function TotalsHero({ total, counts, metricsData, sparkData }) {
  return (
    <div className="bg-green-900 rounded-2xl overflow-hidden flex-shrink-0">
      <div className="px-5 pt-5 pb-2">
        <p className="text-xs font-bold text-green-400 uppercase tracking-widest">Total Tasks</p>
        <p className="text-5xl font-bold text-white mt-2 tracking-tight leading-none">{total}</p>
        <p className="text-sm text-green-400 mt-2">across all stages</p>
      </div>
      {/* Fixed-height wrapper so ResponsiveContainer can measure itself */}
      <div className="px-2 pb-2" style={{ height: 78 }}>
        <ResponsiveContainer width="100%" height={70}>
          <AreaChart data={sparkData} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#4ade80" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke="#4ade80" strokeWidth={2} fill="url(#sparkGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-2 px-5 pb-5">
        {[
          { label: "Done",   value: counts.finished                },
          { label: "Urgent", value: metricsData?.urgentTasks || 0 },
        ].map(({ label, value }) => (
          <div key={label} className="flex-1 bg-green-800 rounded-xl px-3 py-3 text-center">
            <p className="text-xs text-green-400 font-medium">{label}</p>
            <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompletionCard({ counts, total, completionPct }) {
  const r    = 30;
  const circ = 2 * Math.PI * r;

  return (
    <Card title="Completion Rate" subtitle="Tasks finished vs total" className="flex-shrink-0">
      <div className="flex items-center gap-5">
        {/* SVG ring */}
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r={r} fill="none" stroke="#dcfce7" strokeWidth="8" />
            <circle cx="40" cy="40" r={r} fill="none" stroke="#166534" strokeWidth="8"
              strokeDasharray={circ}
              strokeDashoffset={circ - (completionPct / 100) * circ}
              strokeLinecap="round" transform="rotate(-90 40 40)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-base font-bold text-green-900 leading-none">{completionPct}%</span>
            <span className="text-[9px] text-gray-400 mt-0.5">done</span>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 flex-1">
          {STATUS.map(({ key, label, color }) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                <span className="text-xs text-gray-500">{label}</span>
              </div>
              <span className="text-xs font-bold text-gray-800">{counts[key]}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function ProgressCard({ counts, total, completionPct }) {
  return (
    <Card title="Overall Progress" subtitle="Breakdown by status" className="flex-shrink-0">
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-500">All tasks</span>
            <span className="text-xs font-bold text-green-800">{completionPct}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-800 rounded-full transition-all duration-700" style={{ width: `${completionPct}%` }} />
          </div>
        </div>
        {STATUS.map(({ key, label, color }) => {
          const pct = total > 0 ? Math.round((counts[key] / total) * 100) : 0;
          return (
            <div key={key}>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-gray-500">{label}</span>
                <span className="text-xs font-bold text-gray-700">
                  {counts[key]} <span className="font-normal text-gray-400">({pct}%)</span>
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function DashBoard() {
  const { projectId } = useParams();
  const { counts, total, completionPct, avgTime, sparkData, eventsData, metricsData, mostActiveUser, loading } =
    useDashboardData(projectId);

  return (
    <div className="flex flex-col h-screen bg-gray-50 border rounded-lg shadow-md overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center flex-1">
          <BarLoader color="#166534" width={160} />
        </div>
      ) : (
        // Outer body: fixed height, columns laid out side-by-side, each scrolls independently
        <div className="flex-1 overflow-hidden p-4">
          <div className="flex flex-col lg:flex-row gap-4 h-full">

            {/* Col 1 */}
            <div className="w-full max-w-lg flex-shrink-0 flex flex-col gap-4 overflow-y-auto">
              <TotalsHero total={total} counts={counts} metricsData={metricsData} sparkData={sparkData} />
              <ProgressCard counts={counts} total={total} completionPct={completionPct} />
            </div>

            {/* Col 2  */}
            <div className="w-full flex-1 flex flex-col gap-4 overflow-hidden min-w-0">
              <CompletionCard counts={counts} total={total} completionPct={completionPct} />
              <ActivityFeed eventsData={eventsData} />
            </div>

            {/* Col 3 */}
            <div className="w-full lg:w-96 flex-shrink-0 flex flex-col gap-4 overflow-y-auto">
              <MetricsCard avgTime={avgTime} metricsData={metricsData} />
            </div>

          </div>
        </div>
      )}
    </div>
  );
}