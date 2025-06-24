import { useEffect, useRef, useState } from 'react';
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
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL;
export default function AdminDashboard() {
  const [isHovered, setIsHovered] = useState(false);
  const [profile, setProfile] = useState(null);
  const [show, setShow] = useState(false);
  // const [notes, setNotes] = useState(false);
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [activeSection, setActiveSection] = useState('Dashboard');
  const employee_name = localStorage.getItem('name');
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/user/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => setProfile(res.data))
      .catch(err => console.error(err));
  }, []);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);


  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };
  const [notes, setNotes] = useState([]);
  const [playSound, setPlaySound] = useState(false);

  useEffect(() => {
    fetchNotes();
    const interval = setInterval(fetchNotes, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotes = async () => {
    const res = await fetch(`${API_BASE_URL}/api/notifications`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    const unread = data.filter(n => !n.isRead);
    if (unread.length > notes.filter(n => !n.isRead).length) setPlaySound(true);
    setNotes(data);
  };

  useEffect(() => {
    if (playSound) {
      new Audio(`${API_BASE_URL}/notification.mp3`).play();
      setPlaySound(false);
    }
  }, [playSound]);

  const markRead = async (id) => {
    await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setNotes(notes.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const deleteOne = async (id) => {
    await fetch(`${API_BASE_URL}/api/notifications/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setNotes(notes.filter(n => n._id !== id));
  };

  const clearAll = async () => {
    await fetch(`${API_BASE_URL}/api/notifications`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setNotes([]);
  };
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return { text: "Good Morning", icon: "🌅" };
    if (hour < 17) return { text: "Good Afternoon", icon: "☀️" };
    if (hour < 20) return { text: "Good Evening", icon: "🌇" };
    return { text: "Good Night", icon: "🌙" };
  };

  const { text, icon } = getGreeting();
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-100 to-blue-50">
  {/* Mobile Toggle Button */}
  <div className="flex justify-between items-center bg-white shadow md:hidden p-4">
    <div className="text-lg font-semibold text-blue-700">Employee Panel</div>
    <button onClick={() => setIsHovered(!isHovered)} className="text-blue-600 font-bold">
      ☰
    </button>
  </div>

  {/* Sidebar */}
  <motion.aside
    className={`bg-white shadow-lg p-4 pt-6 relative z-30 transition-all duration-300 ${
      isHovered ? 'block' : 'hidden'
    } md:block`}
    initial={{ width: 72 }}
    animate={{ width: isHovered ? 256 : 72 }}
    transition={{ duration: 0.3 }}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    <div className="text-xl font-bold text-blue-700 mb-6 h-10 overflow-hidden flex items-center">
      <AnimatePresence>
        {isHovered && (
          <motion.div
            key="label"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            Employee Panel
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    <nav className="space-y-6 text-sm">
      <NavItem icon={<BarChart2 size={18} />} label="Dashboard" isHovered={isHovered} onClick={setActiveSection} />
      <NavItem icon={<FolderGit2 size={18} />} label="Project Management" isHovered={isHovered} onClick={setActiveSection} />
      <NavItem icon={<CalendarCheck size={18} />} label="Task Management" isHovered={isHovered} onClick={setActiveSection} />
      <NavItem icon={<ClipboardList size={18} />} label="Ticket Management" isHovered={isHovered} onClick={setActiveSection} />
      <NavItem icon={<FileText size={18} />} label="Timesheet" isHovered={isHovered} onClick={setActiveSection} />
    </nav>
  </motion.aside>

  {/* Main Content */}
  <main className="flex-1 p-4 sm:p-6 transition-all">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 p-4 bg-white shadow-md rounded-lg border border-gray-200">
      <div className="mb-4 sm:mb-0">
        <h1 className="text-lg sm:text-2xl font-semibold text-gray-800 flex flex-wrap items-center gap-2">
          {text} {employee_name} {icon}
        </h1>
        <p className="text-sm text-gray-500">Here's what's happening today</p>
      </div>

      {/* Right Section: Notifications & User Dropdown */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Notifications */}
        <div className="relative">
          <Bell
            className="cursor-pointer text-gray-600 hover:text-blue-600 transition w-6 h-6"
            onClick={() => setShow(!show)}
          />
          {notes.some(n => !n.isRead) && (
            <span className="absolute top-[-4px] right-[-5px] bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              {notes.filter(n => !n.isRead).length}
            </span>
          )}
          {show && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white shadow-lg rounded-md z-50 border border-gray-200">
              <div className="flex justify-between items-center p-3 border-b">
                <h4 className="text-sm font-semibold">Notifications</h4>
                <button onClick={clearAll} className="text-xs text-blue-600 hover:underline">Clear All</button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notes.length === 0 ? (
                  <div className="p-4 text-center text-gray-600 text-sm">No notifications</div>
                ) : (
                  notes.map(n => (
                    <div
                      key={n._id}
                      className={`p-3 border-b flex justify-between items-center text-sm ${
                        n.isRead ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <p className="flex-1 hover:underline">{n.message}</p>
                      {!n.isRead && (
                        <button onClick={() => markRead(n._id)} className="text-green-600 hover:underline mr-2">Mark Read</button>
                      )}
                      <button onClick={() => deleteOne(n._id)} className="text-red-600 hover:underline">×</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <UserCircle
            className="w-8 h-8 text-gray-600 cursor-pointer hover:text-blue-600 transition"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <button
                onClick={() => {
                  navigate('/profile');
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Dynamic Sections */}
    {activeSection === 'Dashboard' && <DashboardSection />}
    {activeSection === 'Project Management' && <ProjectManagementSection />}
    {activeSection === 'Ticket Management' && <TicketManagementSection />}
    {activeSection === 'Task Management' && <TaskManagementSection />}
    {activeSection === 'Timesheet' && <TimesheetSection />}
    {activeSection === 'User Management' && <UserManagementSection />}
    {activeSection === 'System Settings' && <SystemSettingsSection />}

    {/* Profile Popup */}
    {showProfile && profile && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            onClick={() => setShowProfile(false)}
          >
            ✕
          </button>
          <h2 className="text-lg font-semibold mb-4">User Profile</h2>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
          {profile.role === 'employee' && (
            <p><strong>Designation:</strong> {profile.designation || 'N/A'}</p>
          )}
        </div>
      </div>
    )}
  </main>
</div>

  );
}

// NavItem Component
function NavItem({ icon, label, isHovered, onClick }) {
  return (
    <div
  className="flex items-center gap-2 sm:gap-3 text-gray-700 hover:text-blue-600 transition-all cursor-pointer px-2 py-2"
  onClick={() => onClick(label)}
>
  {icon}
  <AnimatePresence>
    {(isHovered || window.innerWidth < 640) && ( // show label on hover or small screen
      <motion.span
        key="label"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.2 }}
        className="whitespace-nowrap text-sm sm:text-base"
      >
        {label}
      </motion.span>
    )}
  </AnimatePresence>
</div>

  );
}