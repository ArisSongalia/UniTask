import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { useFetchAnalytics, useFetchTaskData } from "../../../services/FetchData";
import Icon from "../../Icon";
import { IconTitleSection } from "../../TitleSection";

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
    const users = metricsData?.userActivity;
    if (!users?.length) return;
    const freq = users.reduce((acc, u) => ({ ...acc, [u]: (acc[u] || 0) + 1 }), {});
    setMostActiveUser(Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b));
  }, [metricsData]);

  return { counts, total, completionPct, avgTime, sparkData, eventsData, metricsData, mostActiveUser, loading };
}

// ─── Small reusable card wrapper ─────────────────────────────────────────────

function Card({ title, subtitle, children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
      {(title || subtitle) && (
        <div className="px-5 pt-4 pb-3 border-b border-gray-100">
          {title    && <p className="text-sm font-bold text-gray-800">{title}</p>}
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      )}
      <div className="px-5 py-3">{children}</div>
    </div>
  );
}

// ─── Section components ───────────────────────────────────────────────────────

function StatusTiles({ counts }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 flex-shrink-0">
      {STATUS.map(({ key, label, color }) => (
        <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
            <span className="text-xs text-gray-500 font-medium truncate">{label}</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{counts[key]}</p>
        </div>
      ))}
    </div>
  );
}

function MetricsCard({ avgTime, metricsData }) {
  const rows = [
    { label: "Avg Completion",  value: avgTime,                            accent: false },
    { label: "Activity Events", value: metricsData?.projectActivity || 0,  accent: false },
    { label: "Urgent Tasks",    value: metricsData?.urgentTasks     || 0,  accent: true  },
    { label: "Tasks Completed", value: metricsData?.tasksCompleted  || 0,  accent: false },
  ];
  return (
    <Card title="Metrics" subtitle="Project statistics">
      {rows.map(({ label, value, accent }) => (
        <div key={label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
          <span className="text-sm text-gray-500">{label}</span>
          <span className={`text-sm font-bold ${accent ? "text-red-600" : "text-gray-900"}`}>{value}</span>
        </div>
      ))}
    </Card>
  );
}

function ActivityFeed({ eventsData }) {
  return (
    <Card
      title="Recent Activity"
      subtitle={eventsData.length ? `${eventsData.length} events` : "No activity yet"}
      className="flex flex-col flex-1"
    >
      <div className="overflow-y-auto max-h-64">
        {eventsData.length > 0 ? eventsData.slice(0, 5).map(item => {
          const ts       = item.timestamp?.toDate();
          const dateStr  = ts ? ts.toLocaleDateString("en-US", { day: "2-digit", month: "short" }) : "—";
          const timeStr  = ts ? ts.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "Just now";
          const initials = item.team?.[0]?.username?.[0]?.toUpperCase() ?? "S";
          const names    = item.team?.map(m => m.username).join(", ") || "System";
          return (
            <div key={item.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
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
              <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
            </div>
          );
        }) : (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-gray-300">
            <Icon dataFeather="clock" className="w-8 h-8 p-1" />
            <p className="text-sm text-gray-400">No recent activity</p>
          </div>
        )}
      </div>
    </Card>
  );
}

function TotalsHero({ total, counts, metricsData, sparkData }) {
  return (
    <div className="bg-green-900 rounded-2xl overflow-hidden">
      <div className="px-5 pt-5 pb-2">
        <p className="text-xs font-bold text-green-400 uppercase tracking-widest">Total Tasks</p>
        <p className="text-5xl font-bold text-white mt-2 tracking-tight leading-none">{total}</p>
        <p className="text-sm text-green-400 mt-2">across all stages</p>
      </div>
      <div className="px-2 pb-2">
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
          { label: "Done",   value: counts.finished                 },
          { label: "Urgent", value: metricsData?.urgentTasks || 0  },
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
  // SVG ring
  const r    = 30;
  const circ = 2 * Math.PI * r;
  const ring = (
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
  );

  return (
    <Card title="Completion Rate" subtitle="Tasks finished vs total">
      <div className="flex items-center gap-5">
        {ring}
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
    <Card title="Overall Progress">
      <div className="flex flex-col gap-4">
        {/* Overall */}
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-500">All tasks</span>
            <span className="text-xs font-bold text-green-800">{completionPct}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-800 rounded-full transition-all duration-700" style={{ width: `${completionPct}%` }} />
          </div>
        </div>
        {/* Per-status */}
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

      {/* Header — fixed height */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white flex-shrink-0">
        <IconTitleSection
          title="Dashboard"
          titleClassName="text-lg font-merriweather"
          className="bg-transparent border-0 shadow-none p-0"
        />
        {mostActiveUser && (
          <div className="flex items-center gap-2 bg-green-900 text-white px-3 py-1.5 rounded-full">
            <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-[10px] font-bold">
              {mostActiveUser[0]?.toUpperCase()}
            </div>
            <span className="text-xs font-semibold">Most active: {mostActiveUser}</span>
          </div>
        )}
      </div>

      {/* Body — scrollable */}
      {loading ? (
        <div className="flex items-center justify-center flex-1">
          <BarLoader color="#166534" width={160} />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4">
          <StatusTiles counts={counts} />

          <div className="flex flex-col lg:flex-row gap-4">

            {/* Col 1 */}
            <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-4 overflow-y-auto">
              <MetricsCard avgTime={avgTime} metricsData={metricsData} />
              <Card>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Avg Completion Time</p>
                <p className="text-4xl font-bold text-green-900 tracking-tight">{avgTime}</p>
                <p className="text-xs text-gray-400 mt-1">{metricsData?.tasksCompleted || 0} tasks measured</p>
              </Card>
            </div>

            {/* Col 2 */}
            <div className="w-full flex-1 overflow-y-auto">
              <ActivityFeed eventsData={eventsData} />
              <ProgressCard counts={counts} total={total} completionPct={completionPct} />

            </div>

            {/* Col 3 */}
            <div className="w-full lg:w-96 flex-shrink-0 flex flex-col gap-4 overflow-y-auto">
              <TotalsHero total={total} counts={counts} metricsData={metricsData} sparkData={sparkData} />
              <CompletionCard counts={counts} total={total} completionPct={completionPct} />
            </div>

          </div>
        </div>
      )}
    </div>
  );
}