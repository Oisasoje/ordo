import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type TaskPriority = "High" | "Medium" | "Low";
export type TaskStatus = "Todo" | "Doing" | "Done";

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: TaskPriority;
  createdAt: number;
  dueDate: number;
  tags: string[];
  status: TaskStatus;
}

export type ActivityAction = "Created" | "Edited" | "Moved" | "Deleted";

export interface ActivityEntry {
  id: number;
  action: ActivityAction;
  taskTitle: string;
  timestamp: number;
  metadata?: {
    from?: TaskStatus;
    to?: TaskStatus;
  };
}

const now = Date.now();

const defaultTasks: Task[] = [
  {
    id: 1,
    title: "Build landing page",
    description: "Create responsive landing page with hero section",
    priority: "High",
    createdAt: now - 1000 * 60 * 60 * 24,
    dueDate: now + 1000 * 60 * 60 * 24 * 2,
    tags: ["#frontend", "#design"],
    status: "Todo",
  },
  {
    id: 2,
    title: "Implement authentication",
    description: "Add login/signup with JWT",
    priority: "High",
    createdAt: now - 1000 * 60 * 60 * 2,
    dueDate: now + 1000 * 60 * 60 * 24 * 5,
    tags: ["#auth", "#security"],
    status: "Doing",
  },
  {
    id: 3,
    title: "Design wireframes",
    description: "Create wireframes for the landing page",
    priority: "Low",
    createdAt: now - 1000 * 60 * 60 * 24 * 5,
    dueDate: now - 1000 * 60 * 60 * 24,
    tags: ["#design"],
    status: "Done",
  },
  {
    id: 4,
    title: "Setup database",
    description: "Setup database for the application",
    priority: "Medium",
    createdAt: now,
    dueDate: now + 1000 * 60 * 60 * 24,
    tags: ["#backend"],
    status: "Todo",
  },
];

interface TasksStore {
  tasks: Task[];
  activities: ActivityEntry[];
  searchQuery: string;
  priorityFilter: TaskPriority | "All";
  sortBy: "Due date" | "Priority" | "Created date";

  addTask: (task: Task) => void;
  removeTask: (id: number) => void;
  updateTask: (task: Task) => void;
  moveTask: (id: number, status: TaskStatus) => void;
  resetTasks: () => void;

  setSearchQuery: (query: string) => void;
  setPriorityFilter: (filter: TaskPriority | "All") => void;
  setSortBy: (sortBy: TasksStore["sortBy"]) => void;
}

const pushActivity = (activities: ActivityEntry[], entry: ActivityEntry) =>
  [entry, ...activities].slice(0, 50);

const useTaskStore = create<TasksStore>()(
  persist(
    (set, get) => ({
      tasks: defaultTasks,
      activities: [],
      searchQuery: "",
      priorityFilter: "All",
      sortBy: "Created date",

      addTask: (task) =>
        set((state) => {
          const ts = Date.now();

          return {
            tasks: [...state.tasks, task],
            activities: pushActivity(state.activities, {
              id: ts,
              action: "Created",
              taskTitle: task.title,
              timestamp: ts,
            }),
          };
        }),

      removeTask: (id) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          if (!task) return {};

          const ts = Date.now();

          return {
            tasks: state.tasks.filter((t) => t.id !== id),
            activities: pushActivity(state.activities, {
              id: ts,
              action: "Deleted",
              taskTitle: task.title,
              timestamp: ts,
            }),
          };
        }),

      updateTask: (updatedTask) =>
        set((state) => {
          const oldTask = state.tasks.find((t) => t.id === updatedTask.id);
          if (!oldTask) return {};

          const ts = Date.now();
          const isMove = oldTask.status !== updatedTask.status;

          return {
            tasks: state.tasks.map((t) =>
              t.id === updatedTask.id ? updatedTask : t,
            ),
            activities: pushActivity(state.activities, {
              id: ts,
              action: isMove ? "Moved" : "Edited",
              taskTitle: updatedTask.title,
              timestamp: ts,
              metadata: isMove
                ? { from: oldTask.status, to: updatedTask.status }
                : undefined,
            }),
          };
        }),

      moveTask: (id, newStatus) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          if (!task || task.status === newStatus) return {};

          const ts = Date.now();

          return {
            tasks: state.tasks.map((t) =>
              t.id === id ? { ...t, status: newStatus } : t,
            ),
            activities: pushActivity(state.activities, {
              id: ts,
              action: "Moved",
              taskTitle: task.title,
              timestamp: ts,
              metadata: { from: task.status, to: newStatus },
            }),
          };
        }),

      resetTasks: () =>
        set(() => ({
          tasks: [...defaultTasks],
          activities: [],
          searchQuery: "",
          priorityFilter: "All",
          sortBy: "Created date",
        })),

      setSearchQuery: (query) => set({ searchQuery: query }),
      setPriorityFilter: (filter) => set({ priorityFilter: filter }),
      setSortBy: (sortBy) => set({ sortBy }),
    }),
    {
      name: "tasks",
      storage: createJSONStorage(() => localStorage),

      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn("Storage rehydration failed");
          return;
        }

        if (!state) return;

        if (!Array.isArray(state.tasks)) state.tasks = [];
        if (!Array.isArray(state.activities)) state.activities = [];
      },
    },
  ),
);

export default useTaskStore;
