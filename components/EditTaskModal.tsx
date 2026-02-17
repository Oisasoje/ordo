"use client";

import useTaskStore, { Task } from "@/store/taskStore";
import { X, Calendar, Tag, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
7;

const taskSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["High", "Medium", "Low"] as const),
  status: z.enum(["Todo", "Doing", "Done"] as const),
  tags: z.string().trim().min(1, "Tags are required"),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export default function EditTaskModal({
  isOpen,
  onClose,
  task,
}: EditTaskModalProps) {
  const { updateTask } = useTaskStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  useEffect(() => {
    if (task && isOpen) {
      reset({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        status: task.status,
        dueDate: new Date(task.dueDate).toISOString().split("T")[0],
        tags: task.tags.join(", "),
      });
    }
  }, [task, isOpen, reset]);

  const handleClose = () => {
    onClose();
  };

  const onSubmit = (data: TaskFormData) => {
    if (!task) return;

    updateTask({
      ...task,
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: data.status,
      dueDate: new Date(data.dueDate).getTime(),
      tags: data.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== ""),
    });

    onClose();
  };

  if (!isOpen || !task) return null;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 w-full h-full sm:h-auto sm:max-w-md flex flex-col sm:rounded-xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-gray-700 shrink-0">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Edit Task
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-neutral-400 cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          className="p-6 space-y-4 overflow-y-auto flex-1"
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-1">
              Task Title
            </label>
            <input
              type="text"
              {...register("title")}
              placeholder="What needs to be done?"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white ${
                errors.title
                  ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                  : "border-neutral-300 dark:border-gray-600"
              }`}
            />
            <p className="text-xs h-3 text-red-500 mt-1">
              {errors.title?.message}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              {...register("description")}
              placeholder="Add more details..."
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none dark:bg-gray-700 dark:text-white ${
                errors.description
                  ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                  : "border-neutral-300 dark:border-gray-600"
              }`}
            />
            <p className="text-xs h-3 text-red-500 mt-1">
              {errors.description?.message}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <div className="relative">
                <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <select
                  {...register("priority")}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                {...register("status")}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Todo">Todo</option>
                <option value="Doing">Doing</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-1">
                Due Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="date"
                  {...register("dueDate")}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer dark:bg-gray-700 dark:text-white dark:color-scheme-dark ${
                    errors.dueDate
                      ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                      : "border-neutral-300 dark:border-gray-600"
                  }`}
                />
              </div>
              <p className="text-xs h-3 text-red-500 mt-1">
                {errors.dueDate?.message}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-1">
                Tags
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  {...register("tags")}
                  placeholder="#frontend, #coding"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:bg-gray-700 dark:text-white ${
                    errors.tags
                      ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                      : "border-neutral-300 dark:border-gray-600"
                  }`}
                />
              </div>
              <p className="text-xs h-3 text-red-500 mt-1">
                {errors.tags?.message}
              </p>
            </div>
          </div>

          <div className="pt-4 flex gap-3 mt-auto">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-neutral-300 dark:border-gray-600 text-neutral-700 dark:text-gray-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-gray-700 transition-colors font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm cursor-pointer shadow-blue-200 dark:shadow-none"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
