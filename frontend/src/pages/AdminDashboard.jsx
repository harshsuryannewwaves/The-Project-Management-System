import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, UserCircle, Settings, BarChart2, Users,
  ClipboardList, CalendarCheck, FileText,
  FolderGit2
} from 'lucide-react';
import DashboardSection from '@/components/admin/DashboardSection';
import ProjectManagementSection from '@/components/admin/ProjectManagementSection';
import TicketManagementSection from '@/components/admin/TicketManagementSection';
import TaskManagementSection from '@/components/admin/TaskManagementSection';
import TimesheetSection from '@/components/admin/TimesheetSection';
import UserManagementSection from '@/components/admin/UserManagementSection';

export default function AdminDashboard() {
  const [isHovered, setIsHovered] = useState(false);
  const [activeSection, setActiveSection] = useState('Dashboard');

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
          <NavItem icon={<BarChart2 size={18} />} label="Dashboard" isHovered={isHovered} onClick={setActiveSection} />
          <NavItem icon={<FolderGit2 size={18} />} label="Project Management" isHovered={isHovered} onClick={setActiveSection} />
          <NavItem icon={<ClipboardList size={18} />} label="Ticket Management" isHovered={isHovered} onClick={setActiveSection} />
          <NavItem icon={<CalendarCheck size={18} />} label="Task Management" isHovered={isHovered} onClick={setActiveSection} />
          <NavItem icon={<FileText size={18} />} label="Timesheet" isHovered={isHovered} onClick={setActiveSection} />
          <NavItem icon={<Users size={18} />} label="User Management" isHovered={isHovered} onClick={setActiveSection} />
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

        {/* Dynamic Content Section */}
        {activeSection === 'Dashboard' && <DashboardSection />}
        {activeSection === 'Project Management' && <ProjectManagementSection />}
        {activeSection === 'Ticket Management' && <TicketManagementSection />}
        {activeSection === 'Task Management' && <TaskManagementSection />}
        {activeSection === 'Timesheet' && <TimesheetSection />}
        {activeSection === 'User Management' && <UserManagementSection />}
        {activeSection === 'System Settings' && <SystemSettingsSection />}

      </main>
    </div>
  );
}


// NavItem Component
function NavItem({ icon, label, isHovered, onClick }) {
  return (
    <div
      className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-all cursor-pointer"
      onClick={() => onClick(label)}
    >
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



