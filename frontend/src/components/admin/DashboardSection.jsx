import { useEffect, useState } from 'react';

export default function DashboardSection() {
  const [stats, setStats] = useState({});
  const [selectedCard, setSelectedCard] = useState('');
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard/stats')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  const handleCardClick = (type) => {
    setSelectedCard(type);
    fetch(`http://localhost:5000/api/dashboard/${type}`)
      .then(res => res.json())
      .then(data => setTableData(data));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card title="Total Employees" value={stats.totalEmployees} onClick={() => handleCardClick('employees')} />
        <Card title="Projects Completed" value={stats.projectsCompleted} onClick={() => handleCardClick('projects-completed')} />
        <Card title="Projects In Progress" value={stats.projectsInProgress} onClick={() => handleCardClick('projects-in-progress')} />
        <Card title="Tickets Raised" value={stats.ticketsRaised} onClick={() => handleCardClick('tickets')} />
        <Card title="Tickets Closed" value={stats.ticketsClosed} onClick={() => handleCardClick('tickets-closed')} />
        <Card title="Pending Tickets" value={stats.ticketsPending} onClick={() => handleCardClick('tickets-pending')} />
      </div>

      {selectedCard && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 capitalize">{selectedCard.replaceAll('-', ' ')} Details</h3>
          {tableData.length === 0 ? (
            <p className="text-gray-500 text-sm">No data available.</p>
          ) : (
            <table className="w-full table-auto text-sm text-left">
              <thead>
                <tr className="bg-gray-100">
                  {Object.keys(tableData[0]).map((key) => (
                    <th key={key} className="px-4 py-2 capitalize">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, idx) => (
                  <tr key={idx} className="border-t">
                    {Object.values(item).map((val, i) => (
                      <td key={i} className="px-4 py-2">{val?.toString()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

function Card({ title, value, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer p-6 rounded-xl shadow-sm bg-blue-50 hover:bg-blue-100 transition"
    >
      <h2 className="text-sm font-medium text-gray-600">{title}</h2>
      <p className="text-2xl font-bold text-blue-600">{value ?? '—'}</p>
    </div>
  );
}
