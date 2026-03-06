import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchActiveProjectData, useFetchTaskData } from "../../../services/FetchData";
import { IconText } from "../../Icon";
import TitleSection from "../../TitleSection";
import { TaskFocus } from "../SharedModals";

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateDays(startDate, numberOfDays) {
  return Array.from({ length: numberOfDays }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return date;
  });
}

function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function isToday(date) {
  return isSameDay(date, new Date());
}

// ─── Status pill ────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  "To-do":       "bg-slate-100 text-slate-600 border-slate-200",
  "In-progress": "bg-blue-100 text-blue-700 border-blue-200",
  "To-review":   "bg-amber-100 text-amber-700 border-amber-200",
  "Finished":    "bg-emerald-100 text-emerald-700 border-emerald-200",
};

function StatusPill({ status }) {
  const style = STATUS_STYLES[status] ?? "bg-gray-100 text-gray-500 border-gray-200";
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${style}`}>
      {status}
    </span>
  );
}

// ─── Task chip ───────────────────────────────────────────────────────────────

function TaskChip({ task, onClick }) {
  const style = STATUS_STYLES[task.status] ?? "bg-gray-100 text-gray-700 border-gray-200";
  return (
    <button
      onClick={() => onClick(task)}
      className={`
        w-full text-left px-2 py-1.5 rounded-lg border text-xs font-medium
        leading-snug truncate transition-all duration-150
        hover:shadow-sm hover:brightness-95 active:scale-95
        ${style}
      `}
      title={task.title}
    >
      {task.title}
    </button>
  );
}

// ─── Day column ──────────────────────────────────────────────────────────────

const DayColumn = forwardRef(function DayColumn({ day, isFirst, prevDay, tasks, onTaskClick }, ref) {
  const showMonth = isFirst || day.getMonth() !== prevDay?.getMonth();
  const today = isToday(day);
  const isWeekend = day.getDay() === 0 || day.getDay() === 6;

  return (
    <div
      ref={ref}
      className={`
        flex flex-col flex-shrink-0 min-w-[72px] w-[72px]
        border-r border-gray-200
        ${isWeekend ? "bg-gray-50" : "bg-white"}
        ${today ? "ring-1 ring-inset ring-green-700" : ""}
      `}
    >
      {/* Month label row — always rendered to keep alignment */}
      <div className="h-7 flex items-center justify-center border-b border-gray-100 bg-gray-50">
        {showMonth && (
          <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">
            {day.toLocaleString("en-US", { month: "short" })}
          </span>
        )}
      </div>

      {/* Day number */}
      <div
        className={`
          flex flex-col items-center justify-center h-9 border-b border-gray-200
          ${today ? "bg-green-700" : ""}
        `}
      >
        <span
          className={`text-sm font-bold leading-none ${today ? "text-white" : "text-gray-700"}`}
        >
          {day.getDate()}
        </span>
        <span
          className={`text-[9px] uppercase font-medium mt-0.5 ${today ? "text-blue-100" : "text-gray-400"}`}
        >
          {day.toLocaleString("en-US", { weekday: "short" })}
        </span>
      </div>

      {/* Tasks */}
      <div className="flex flex-col gap-1 p-1 overflow-y-auto flex-1 min-h-0">
        {tasks.map((task) => (
          <TaskChip key={task.id} task={task} onClick={onTaskClick} />
        ))}
      </div>
    </div>
  );
});

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 text-gray-400 py-16">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
      <p className="text-sm font-medium">No timeline data yet</p>
      <p className="text-xs">Set a start and target date on your project to see the timeline.</p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Timeline() {
  const { projectId } = useParams();
  const [days, setDays] = useState([]);
  const [focusedTask, setFocusedTask] = useState(null);
  const todayRef = useRef(null);

  const { projectData } = useFetchActiveProjectData(projectId);
  const { taskData } = useFetchTaskData(projectId);

  // Build day range from project dates
  useEffect(() => {
    if (projectData?.createdAt && projectData?.targetDate) {
      const start = projectData.createdAt.toDate();
      const end = projectData.targetDate.toDate();
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      const diffDays = (end - start) / (1000 * 60 * 60 * 24) + 1;
      setDays(generateDays(start, diffDays));
    }
  }, [projectData]);

  // Scroll to today on load
  useEffect(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [days]);

  // Pre-bucket tasks by day key for O(1) lookup
  const tasksByDay = useMemo(() => {
    const map = {};
    for (const task of taskData ?? []) {
      if (!task.deadline) continue;
      const d = task.deadline.toDate();
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map[key]) map[key] = [];
      map[key].push(task);
    }
    return map;
  }, [taskData]);

  const getDayTasks = (day) => {
    const key = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
    return tasksByDay[key] ?? [];
  };

  // Summary counts
  const totalTasks = taskData?.length ?? 0;
  const finishedCount = taskData?.filter((t) => t.status === "Finished").length ?? 0;

  return (
    <div className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full w-full">

      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="font-semibold text-gray-800 text-sm leading-tight">Timeline</h2>
            <p className="text-xs text-gray-400">
              {days.length > 0
                ? `${days.length} days · ${finishedCount}/${totalTasks} tasks done`
                : "No date range set"}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3">
          {Object.entries(STATUS_STYLES).map(([status, style]) => (
            <span key={status} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${style}`}>
              {status}
            </span>
          ))}
        </div>
      </header>

      {/* Timeline grid */}
      {days.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-1 overflow-x-auto overflow-y-hidden min-h-0">
          {days.map((day, i) => {
            const today = isToday(day);
            return (
              <DayColumn
                key={i}
                ref={today ? todayRef : null}
                day={day}
                isFirst={i === 0}
                prevDay={days[i - 1]}
                tasks={getDayTasks(day)}
                onTaskClick={setFocusedTask}
              />
            );
          })}
        </div>
      )}

      {/* Task focus modal */}
      {focusedTask && (
        <TaskFocus
          taskData={focusedTask}
          closeModal={() => setFocusedTask(null)}
        />
      )}
    </div>
  );
}