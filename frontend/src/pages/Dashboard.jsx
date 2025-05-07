import { Bell, UserCircle } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 space-y-6">
        <div className="text-2xl font-bold text-blue-700">MyDashboard</div>
        <nav className="space-y-4">
          <a href="#" className="block font-semibold text-blue-600">Dashboard</a>
          <a href="#" className="block text-gray-700 hover:text-blue-500">Ticket Management</a>
          <a href="#" className="block text-gray-700 hover:text-blue-500">Task Management</a>
          <a href="#" className="block text-gray-700 hover:text-blue-500">Time Sheet</a>
          <a href="#" className="block text-gray-700 hover:text-blue-500">Notifications</a>
          <a href="#" className="block text-gray-700 hover:text-blue-500">Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Topbar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold text-gray-800">Good Morning, Harsh 👋</h1>
          <div className="flex items-center gap-4">
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
            <UserCircle className="w-8 h-8 text-gray-600 cursor-pointer" />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="Open Tickets" value="12" color="bg-red-100" textColor="text-red-600" />
          <Card title="Completed Tasks" value="34" color="bg-green-100" textColor="text-green-600" />
          <Card title="Time Logged Today" value="5h 20m" color="bg-blue-100" textColor="text-blue-600" />
          <Card title="Overdue Tasks" value="3" color="bg-yellow-100" textColor="text-yellow-600" />
        </div>
      </main>
    </div>
  );
}

function Card({ title, value, color, textColor }) {
  return (
    <div className={`p-6 rounded-xl shadow-sm ${color}`}>
      <h2 className="text-sm font-medium text-gray-600">{title}</h2>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
}
