import React from "react";
import {
  Search,
  Filter,
  Plus,
  LogOut,
  Calendar,
  Tag,
  AlertCircle,
  Clock,
  MoreVertical,
  RefreshCw,
} from "lucide-react";

export default function BoardPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-neutral-900">
              TaskFlow Board
            </h1>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Reset Board
              </button>

              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Task
              </button>

              <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select className="px-4 py-2 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <select className="px-4 py-2 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Sort by</option>
              <option>Due date</option>
              <option>Priority</option>
              <option>Created date</option>
            </select>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TODO Column */}
          <div className="bg-neutral-100 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-neutral-700">TODO</h2>
              <span className="bg-white px-2 py-1 rounded text-sm text-neutral-600">
                3
              </span>
            </div>

            <div className="space-y-3">
              {/* Task Card 1 */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200 cursor-move hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-neutral-900">
                    Build landing page
                  </h3>
                  <button className="text-neutral-400 hover:text-neutral-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-neutral-600 mb-3">
                  Create responsive landing page with hero section
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                    High
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    #frontend
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    #design
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Feb 20</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Feb 15</span>
                  </div>
                </div>
              </div>

              {/* Task Card 2 */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200 cursor-move hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-neutral-900">
                    Setup database
                  </h3>
                  <button className="text-neutral-400 hover:text-neutral-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                    Medium
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    #backend
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Feb 22</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Feb 14</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DOING Column */}
          <div className="bg-neutral-100 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-neutral-700">DOING</h2>
              <span className="bg-white px-2 py-1 rounded text-sm text-neutral-600">
                2
              </span>
            </div>

            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200 cursor-move hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-neutral-900">
                    Implement authentication
                  </h3>
                  <button className="text-neutral-400 hover:text-neutral-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-neutral-600 mb-3">
                  Add login/signup with JWT
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                    High
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    #auth
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    #security
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Feb 18</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Feb 13</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DONE Column */}
          <div className="bg-neutral-100 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-neutral-700">DONE</h2>
              <span className="bg-white px-2 py-1 rounded text-sm text-neutral-600">
                1
              </span>
            </div>

            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200 cursor-move hover:shadow-md transition-shadow opacity-75">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-neutral-900">
                    Design wireframes
                  </h3>
                  <button className="text-neutral-400 hover:text-neutral-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    Low
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    #design
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Feb 10</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Feb 12</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="mt-8 bg-white rounded-lg border border-neutral-200 p-4">
          <h3 className="font-semibold text-neutral-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-neutral-600">
                Task{" "}
                <span className="font-medium text-neutral-900">
                  "Build landing page"
                </span>{" "}
                created
              </span>
              <span className="text-neutral-400 text-xs">2 min ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-neutral-600">
                Task moved from <span className="font-medium">TODO</span> to{" "}
                <span className="font-medium">DOING</span>
              </span>
              <span className="text-neutral-400 text-xs">15 min ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span className="text-neutral-600">
                Task{" "}
                <span className="font-medium text-neutral-900">
                  "Design wireframes"
                </span>{" "}
                completed
              </span>
              <span className="text-neutral-400 text-xs">1 hour ago</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
