import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { useFetchAnalytics, useFetchTaskData } from "../../../services/FetchData";
import Icon from "../../Icon";
import { IconTitleSection } from "../../TitleSection";

const STATUS = [
  { key: "todo",     label: "To-do",       color: "#6b7280" },
  { key: "progress", label: "In-progress", color: "#2563eb" },
  { key: "review",   label: "To-review",   color: "#d97706" },
  { key: "finished", label: "Finished",    color: "#166534" },
];

// ─── Primitives ───────────────────────────────────────────────────────────────

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ title, subtitle }) {
  return (
    <div className="px-5 pt-4 pb-3 border-b border-gray-100">
      <p className="text-sm font-bold text-gray-800">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

function MetricRow({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-bold ${accent ? "text-red-600" : "text-gray-900"}`}>
        {value}
      </span>
    </div>
  );
}

function StatusTile({ label, count, color }) {
  return (
    <Card>
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
          <span className="text-xs text-gray-500 font-medium truncate">{label}</span>
        </div>
        <p className="text-3xl font-bold text-gray-900">{count}</p>
      </div>
    </Card>
  );
}

function CompletionRing({ pct }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="relative w-20 h-20 flex-shrink-0">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#dcfce7" strokeWidth="8" />
        <circle
          cx="40" cy="40" r={r} fill="none"
          stroke="#166534" strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-bold text-green-900 leading-none">{pct}%</span>
        <span className="text-[9px] text-gray-400 mt-0.5">done</span>
      </div>
    </div>
  );
}

function ActivityItem({ item }) {
  const ts = item.timestamp?.toDate();
  const dateStr = ts
    ? ts.toLocaleDateString("en-US", { day: "2-digit", month: "short" })
    : "—";
  const timeStr = ts
    ? ts.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    : "Just now";

  const initials = item.team?.[0]?.username?.[0]?.toUpperCase() ?? "S";
  const names    = item.team?.map(m => m.username).join(", ") || "System";

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
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
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function DashBoard() {
  const { projectId } = useParams();
  const { taskData, loading: tasksLoading } = useFetchTaskData();
  const { eventsData = [], metricsData = {} } = useFetchAnalytics(projectId);
  const [mostActiveUser, setMostActiveUser] = useState(null);

  const { counts, sparkData } = useMemo(() => {
    const todo     = taskData?.filter(t => t.status === "To-do").length       || 0;
    const progress = taskData?.filter(t => t.status === "In-progress").length || 0;
    const review   = taskData?.filter(t => t.status === "To-review").length   || 0;
    const finished = taskData?.filter(t => t.status === "Finished").length    || 0;
    return {
      counts: { todo, progress, review, finished },
      sparkData: [
        { v: todo },
        { v: Math.round((todo + progress) / 2) },
        { v: progress },
        { v: Math.round((progress + review) / 2) },
        { v: review },
        { v: Math.round((review + finished) / 2) },
        { v: finished },
      ],
    };
  }, [taskData]);

  const displayAvgTime = useMemo(() => {
    const total     = metricsData?.totalCompletionTime || 0;
    const completed = metricsData?.tasksCompleted       || 0;
    if (completed === 0) return "—";
    const avgMs = total / completed;
    const h = Math.floor(avgMs / 3600000);
    const m = Math.floor((avgMs % 3600000) / 60000);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }, [metricsData]);

  useEffect(() => {
    const users = metricsData?.userActivity;
    if (!users?.length) return;
    const freq = users.reduce((acc, u) => ({ ...acc, [u]: (acc[u] || 0) + 1 }), {});
    setMostActiveUser(Object.keys(freq).reduce((a, b) => (freq[a] > freq[b] ? a : b)));
  }, [metricsData]);

  const total         = counts.todo + counts.progress + counts.review + counts.finished;
  const completionPct = total > 0 ? Math.round((counts.finished / total) * 100) : 0;

  return (
    <div className="flex flex-col w-full h-full bg-gray-50 border rounded-lg shadow-md overflow-hidden">

      {/* ── Header ── */}
        <IconTitleSection
          title="Dashboard"
          titleClassName="text-lg font-merriweather"
          className="bg-transparent border-0 shadow-none p-4 pb-0"
        />
        {mostActiveUser && (
          <div className="flex items-center gap-2 bg-green-900 text-white px-3 py-1.5 rounded-full">
            <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-[10px] font-bold">
              {mostActiveUser[0]?.toUpperCase()}
            </div>
            <span className="text-xs font-semibold">Most active: {mostActiveUser}</span>
          </div>
        )}


      {/* ── Body ── */}
      {tasksLoading ? (
        <div className="flex items-center justify-center flex-1">
          <BarLoader color="#166534" width={160} />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4">

          {/* ── Status tiles (always 2-up, 4-up on wide screens) ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {STATUS.map(s => (
              <StatusTile key={s.key} label={s.label} count={counts[s.key]} color={s.color} />
            ))}
          </div>

          {/* ── Main content: stacks on mobile, 3-col on desktop ── */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch">

            {/* ── Column 1: Metrics ── */}
            <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-4">

              <Card>
                <CardHeader title="Metrics" subtitle="Project statistics" />
                <div className="px-5 py-1 pb-3">
                  <MetricRow label="Avg Completion"  value={displayAvgTime} />
                  <MetricRow label="Activity Events" value={metricsData?.projectActivity || 0} />
                  <MetricRow label="Urgent Tasks"    value={metricsData?.urgentTasks     || 0} accent />
                  <MetricRow label="Tasks Completed" value={metricsData?.tasksCompleted  || 0} />
                </div>
              </Card>

              <Card>
                <div className="px-5 py-4">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
                    Avg Completion Time
                  </p>
                  <p className="text-4xl font-bold text-green-900 tracking-tight">{displayAvgTime}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {metricsData?.tasksCompleted || 0} tasks measured
                  </p>
                </div>
              </Card>
            </div>

            {/* ── Column 2: Activity feed ── */}
            <div className="w-full flex-1 flex flex-col">

              <Card className="flex flex-col flex-1">
                <CardHeader
                  title="Recent Activity"
                  subtitle={eventsData.length > 0 ? `${eventsData.length} events` : "No activity yet"}
                />
                <div className="px-5 py-1 pb-3 flex-1 overflow-y-auto">
                  {eventsData.length > 0 ? (
                    eventsData.slice(0, 5).map(item => (
                      <ActivityItem key={item.id} item={item} />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-8 gap-2 text-gray-300">
                      <Icon dataFeather="clock" className="w-8 h-8 p-1" />
                      <p className="text-sm text-gray-400">No recent activity</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* ── Column 3: Total hero + completion ── */}
            <div className="w-full lg:w-96 flex-shrink-0 flex flex-col gap-4">

              {/* Dark hero card */}
              <Card className="bg-green-900 border-0">
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
                      <Area
                        type="monotone" dataKey="v"
                        stroke="#4ade80" strokeWidth={2}
                        fill="url(#sparkGrad)" dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-2 px-5 pb-5">
                  <div className="flex-1 bg-green-800 rounded-xl px-3 py-3 text-center">
                    <p className="text-xs text-green-400 font-medium">Done</p>
                    <p className="text-2xl font-bold text-white mt-0.5">{counts.finished}</p>
                  </div>
                  <div className="flex-1 bg-green-800 rounded-xl px-3 py-3 text-center">
                    <p className="text-xs text-green-400 font-medium">Urgent</p>
                    <p className="text-2xl font-bold text-white mt-0.5">{metricsData?.urgentTasks || 0}</p>
                  </div>
                </div>
              </Card>

              {/* Completion ring */}
              <Card>
                <CardHeader title="Completion Rate" subtitle="Tasks finished vs total" />
                <div className="px-5 pb-5 flex items-center gap-5">
                  <CompletionRing pct={completionPct} />
                  <div className="flex flex-col gap-2.5 flex-1">
                    {STATUS.map(s => (
                      <div key={s.key} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                          <span className="text-xs text-gray-500">{s.label}</span>
                        </div>
                        <span className="text-xs font-bold text-gray-800">{counts[s.key]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Progress bars */}
              <Card>
                <CardHeader title="Overall Progress" />
                <div className="px-5 pb-5 flex flex-col gap-4">
                  {/* Overall bar */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs font-medium text-gray-500">All tasks</span>
                      <span className="text-xs font-bold text-green-800">{completionPct}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-800 rounded-full transition-all duration-700"
                        style={{ width: `${completionPct}%` }}
                      />
                    </div>
                  </div>
                  {/* Per-status bars */}
                  {STATUS.map(s => {
                    const pct = total > 0 ? Math.round((counts[s.key] / total) * 100) : 0;
                    return (
                      <div key={s.key}>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-xs text-gray-500">{s.label}</span>
                          <span className="text-xs font-bold text-gray-700">
                            {counts[s.key]}{" "}
                            <span className="font-normal text-gray-400">({pct}%)</span>
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, background: s.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}