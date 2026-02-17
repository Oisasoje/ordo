"use client";

import AuthGuard from "@/components/AuthGuard";
import TaskColumn, { TaskCard } from "@/components/todo";
import useTaskStore, { Task, TaskStatus } from "@/store/taskStore";
import { Search, Plus, LogOut, RefreshCw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import CreateTaskModal from "@/components/CreateTaskModal";
import EditTaskModal from "@/components/EditTaskModal";
import { useAuthStore } from "@/store/authStore";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

import ThemeToggle from "@/components/ThemeToggle";

export default function BoardPage() {
  const {
    tasks,
    activities,
    resetTasks,
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    sortBy,
    setSortBy,
    moveTask,
  } = useTaskStore();
  const { logout, user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const resetConfirmRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resetConfirmRef.current &&
        !resetConfirmRef.current.contains(event.target as Node)
      ) {
        setShowResetConfirm(false);
      }
    };

    if (showResetConfirm) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showResetConfirm]);

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "Created":
        return "bg-green-500";
      case "Edited":
        return "bg-blue-500";
      case "Moved":
        return "bg-yellow-500";
      case "Deleted":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as number;
    const newStatus = over.id as TaskStatus;

    moveTask(taskId, newStatus);
    setActiveTask(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t: Task) => t.id === (event.active.id as number));
    if (task) setActiveTask(task);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-neutral-50 dark:bg-gray-950 text-neutral-900 dark:text-white leading-relaxed font-sans antialiased">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-neutral-200 dark:border-gray-800 sticky top-0 z-10 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                TaskFlow Board
              </h1>

              <div className="flex items-center gap-2 sm:gap-3">
                <ThemeToggle />
                <div className="relative" ref={resetConfirmRef}>
                  <button
                    onClick={() => setShowResetConfirm(!showResetConfirm)}
                    className="px-3 sm:px-4 py-2 cursor-pointer text-sm bg-white dark:bg-gray-800 border border-neutral-300 dark:border-gray-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors dark:text-white"
                    aria-label="Reset Board"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${showResetConfirm ? "animate-spin-once" : ""}`}
                    />
                    <span className="hidden sm:inline">Reset Board</span>
                  </button>

                  {showResetConfirm && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-neutral-200 dark:border-gray-700 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <p className="text-sm text-neutral-600 dark:text-gray-300 mb-4">
                        Are you sure? This will clear all tasks and your
                        activity history.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowResetConfirm(false)}
                          className="flex-1 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            resetTasks();
                            setShowResetConfirm(false);
                          }}
                          className="flex-1 px-3 py-1.5 text-xs font-medium bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-3 sm:px-4 py-2 cursor-pointer text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  aria-label="New Task"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New Task</span>
                </button>

                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all cursor-pointer group"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="flex flex-wrap bg-white dark:bg-gray-800 border border-neutral-300 dark:border-gray-700 rounded-lg p-1 gap-1">
                {(["All", "High", "Medium", "Low"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriorityFilter(p)}
                    className={`px-3 py-1 text-sm rounded-md transition-all cursor-pointer flex-1 md:flex-none ${
                      priorityFilter === p
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-neutral-600 dark:text-gray-400 hover:bg-neutral-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-medium text-neutral-400 uppercase pointer-events-none">
                  Sort
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full md:w-auto pl-14 pr-4 py-2 cursor-pointer border border-neutral-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none min-w-[150px]"
                >
                  <option value="Due date">Due date</option>
                  <option value="Priority">Priority</option>
                  <option value="Created date">Created date</option>
                </select>
              </div>
            </div>
          </div>

          {/* Kanban Board */}
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TaskColumn
                status="Todo"
                title="Todo"
                onEdit={(task) => setEditingTask(task)}
              />
              <TaskColumn
                status="Doing"
                title="Doing"
                onEdit={(task) => setEditingTask(task)}
              />
              <TaskColumn
                status="Done"
                title="Done"
                onEdit={(task) => setEditingTask(task)}
              />
            </div>

            <DragOverlay>
              {activeTask ? (
                <div className="w-[calc(33.333vw-2rem)] max-w-sm rotate-3 opacity-90 scale-105 pointer-events-none transition-transform">
                  <TaskCard
                    task={activeTask}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    onPriorityClick={() => {}}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          {/* Activity Log */}
          <div className="mt-8 bg-white dark:bg-gray-900 rounded-lg border border-neutral-200 dark:border-gray-800 p-4">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {activities.length === 0 ? (
                <p className="text-sm text-neutral-400 italic">
                  No recent activity
                </p>
              ) : (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 text-sm animate-in slide-in-from-left-2 duration-200"
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${getActionColor(activity.action)}`}
                    ></span>
                    <span className="text-neutral-600 dark:text-gray-400">
                      Task{" "}
                      <span className="font-medium text-neutral-900 dark:text-white">
                        "{activity.taskTitle}"
                      </span>{" "}
                      {activity.action.toLowerCase()}
                      {activity.action === "Moved" && activity.metadata && (
                        <span className="text-neutral-400 ml-1">
                          ({activity.metadata.from} → {activity.metadata.to})
                        </span>
                      )}
                    </span>
                    <span className="text-neutral-400 text-xs ml-auto">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        <EditTaskModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          task={editingTask}
        />

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-neutral-100 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 mx-auto mb-6 flex items-center justify-center ring-8 ring-red-50/50 dark:ring-red-900/10">
                  <LogOut className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 tracking-tight">
                  Sign out of Ordo?
                </h3>
                <p className="text-neutral-500 dark:text-gray-400 mb-8 leading-relaxed">
                  Are you sure you want to sign out? You'll need to enter your
                  credentials to access your tasks again.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-4 py-3 border border-neutral-200 dark:border-gray-700 text-neutral-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-neutral-50 dark:hover:bg-gray-700 rounded-xl transition-all font-semibold cursor-pointer active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setShowLogoutConfirm(false);
                    }}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all font-semibold shadow-lg shadow-red-200 dark:shadow-none active:scale-[0.98] cursor-pointer"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
