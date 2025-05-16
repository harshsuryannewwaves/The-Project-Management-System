import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, UserCircle, Settings, BarChart2, Users,
  ClipboardList, CalendarCheck, FileText
} from 'lucide-react';

export default function AdminDashboard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-100 to-blue-50">
      {/* Sidebar */}
      <motion.aside
        className="bg-white shadow-lg p-4 pt-6 relative"
        initial={{ width: 72 }}
        animate={{ width: isHovered ? 256 : 72 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="text-2xl font-bold text-blue-700 mb-8 h-10 overflow-hidden flex items-center">
          <AnimatePresence>
            {isHovered && (
              <motion.div
                key="label"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                Admin Panel
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <nav className="space-y-6 text-sm">
          <NavItem icon={<BarChart2 size={18} />} label="Dashboard" isHovered={isHovered} />
          <NavItem icon={<ClipboardList size={18} />} label="Ticket Management" isHovered={isHovered} />
          <NavItem icon={<CalendarCheck size={18} />} label="Task Management" isHovered={isHovered} />
          <NavItem icon={<FileText size={18} />} label="Timesheet" isHovered={isHovered} />
          <NavItem icon={<Users size={18} />} label="User Management" isHovered={isHovered} />
          <NavItem icon={<Settings size={18} />} label="System Settings" isHovered={isHovered} />
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-8 transition-all">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Welcome back, Admin 👋</h1>
            <p className="text-sm text-gray-500">Here's what's happening today</p>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
            <UserCircle className="w-8 h-8 text-gray-600 cursor-pointer" />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="Total Users" value="158" color="bg-indigo-100" textColor="text-indigo-600" />
          <Card title="Active Tickets" value="27" color="bg-red-100" textColor="text-red-600" />
          <Card title="Completed Tasks" value="89" color="bg-green-100" textColor="text-green-600" />
          <Card title="Hours Logged Today" value="12h 45m" color="bg-blue-100" textColor="text-blue-600" />
        </div>

        {/* Recent Activity */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h2>
          <div className="bg-white shadow rounded-lg p-4 text-sm text-gray-600">
            <p>No recent activity available.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

// NavItem Component
function NavItem({ icon, label, isHovered }) {
  return (
    <div className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-all">
      {icon}
      <AnimatePresence>
        {isHovered && (
          <motion.span
            key="label"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

// Card Component
function Card({ title, value, color, textColor }) {
  return (
    <div className={`p-6 rounded-xl shadow-sm ${color}`}>
      <h2 className="text-sm font-medium text-gray-600">{title}</h2>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
}
