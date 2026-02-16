"use client";

import useTaskStore, { Task } from "@/store/taskStore";
import { Calendar, Clock, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onPriorityClick: (priority: "High" | "Medium" | "Low") => void;
}

export const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onPriorityClick,
}: TaskCardProps) => {
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };

    if (activeMenuId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenuId]);

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(new Date(timestamp));
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-neutral-200 dark:border-gray-700 cursor-move hover:shadow-md transition-shadow relative group"
    >
      <div className="flex justify-between items-start mb-2 relative">
        <div {...listeners} {...attributes} className="flex-1 min-w-0 pr-6">
          <h3 className="font-medium text-neutral-900 dark:text-white truncate">
            {task.title}
          </h3>
        </div>
        <div className="relative shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenuId(activeMenuId === task.id ? null : task.id);
            }}
            className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-gray-700 rounded transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {activeMenuId === task.id && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-neutral-200 dark:border-gray-700 py-1 z-20 animate-in fade-in zoom-in-95 duration-100"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                  setActiveMenuId(null);
                }}
                className="w-full px-4 py-2 text-left text-sm text-neutral-700 dark:text-gray-300 hover:bg-neutral-50 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Task
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                  setActiveMenuId(null);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2 cursor-pointer border-t border-neutral-100 dark:border-gray-700"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div {...listeners} {...attributes}>
        {task.description && (
          <p className="text-sm text-neutral-600 dark:text-gray-400 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            onClick={(e) => {
              e.stopPropagation();
              onPriorityClick(task.priority);
            }}
            className={`px-2 py-1 cursor-pointer transition-transform hover:scale-105 active:scale-95 ${
              task.priority === "High"
                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50"
                : task.priority === "Medium"
                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
                  : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50"
            } text-[10px] rounded-full font-semibold uppercase tracking-wider`}
          >
            {task.priority}
          </span>
          {task.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className={`px-2 py-1 ${
                index % 2 === 0
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                  : "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300"
              } text-[10px] rounded-full font-medium`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-[10px] font-medium text-neutral-400 dark:text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatDate(task.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskColumn = ({
  status,
  title,
  onEdit,
}: {
  status: "Todo" | "Doing" | "Done";
  title: string;
  onEdit: (task: Task) => void;
}) => {
  const {
    tasks,
    searchQuery,
    priorityFilter,
    sortBy,
    setPriorityFilter,
    removeTask,
  } = useTaskStore();

  const { setNodeRef } = useDroppable({
    id: status,
  });

  const columnTasks = tasks
    .filter((task: Task) => {
      if (task.status !== status) return false;
      if (priorityFilter !== "All" && task.priority !== priorityFilter)
        return false;

      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDescription = task.description
          ?.toLowerCase()
          .includes(query);
        const matchesTags = task.tags.some((tag: string) =>
          tag.toLowerCase().includes(query),
        );
        if (!matchesTitle && !matchesDescription && !matchesTags) return false;
      }

      return true;
    })
    .sort((a: Task, b: Task) => {
      if (sortBy === "Due date") return a.dueDate - b.dueDate;
      if (sortBy === "Created date") return b.createdAt - a.createdAt;
      if (sortBy === "Priority") {
        const priorityScore = { High: 3, Medium: 2, Low: 1 };
        return priorityScore[b.priority] - priorityScore[a.priority];
      }
      return 0;
    });

  return (
    <div
      ref={setNodeRef}
      className={`bg-neutral-100 dark:bg-gray-900 rounded-xl p-4 min-h-[500px] transition-colors ${
        status === "Done" ? "opacity-75" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-neutral-500 dark:text-gray-400 text-xs uppercase tracking-widest leading-none">
          {title}
        </h2>
        <span className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-neutral-200 dark:border-gray-700 px-2 py-0.5 rounded-full text-[10px] font-bold text-neutral-500 dark:text-gray-400 tabular-nums">
          {columnTasks.length}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {columnTasks.map((task: Task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={removeTask}
            onPriorityClick={setPriorityFilter}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;
