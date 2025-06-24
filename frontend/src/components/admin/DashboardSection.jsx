import { useEffect, useState } from 'react';
const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function DashboardSection() {
  const [stats, setStats] = useState({});
  const [loadingStats, setLoadingStats] = useState(true);
  const [selectedCard, setSelectedCard] = useState('');
  const [tableData, setTableData] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);

  useEffect(() => {
    setLoadingStats(true);
    fetch(`${API_BASE_URL}/api/dashboard/stats`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoadingStats(false);
      })
      .catch(() => setLoadingStats(false));
  }, []);

  const handleCardClick = (type) => {
    setSelectedCard(type);
    setLoadingTable(true);
    fetch(`${API_BASE_URL}/api/dashboard/${type}`)
      .then(res => res.json())
      .then(data => {
        setTableData(data);
        setLoadingTable(false);
      })
      .catch(() => setLoadingTable(false));
  };

  const cardList = [
    { title: 'Total Employees', key: 'totalEmployees', type: 'employees' },
    { title: 'Projects Completed', key: 'projectsCompleted', type: 'projects-completed' },
    { title: 'Projects In Progress', key: 'projectsInProgress', type: 'projects-in-progress' },
    { title: 'Tickets Raised', key: 'ticketsRaised', type: 'tickets' },
    { title: 'Tickets Closed', key: 'ticketsClosed', type: 'tickets-closed' },
    { title: 'Pending Tickets', key: 'ticketsPending', type: 'tickets-pending' },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
    📊 Dashboard Overview
  </h2>

  {loadingStats ? (
    <div className="text-center py-10 text-blue-600 font-medium">
      Loading dashboard stats...
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {cardList.map((card) => (
        <Card
          key={card.title}
          title={card.title}
          value={stats[card.key]}
          onClick={() => handleCardClick(card.type)}
        />
      ))}
    </div>
  )}

  {selectedCard && (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md transition-all">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 capitalize">
        {selectedCard.replaceAll('-', ' ')} Details
      </h3>

      {loadingTable ? (
        <div className="text-center py-10 text-blue-500 font-medium">
          Loading table data...
        </div>
      ) : tableData.length === 0 ? (
        <p className="text-gray-500 text-sm">No data available.</p>
      ) : (
        <div className="overflow-x-auto max-h-[60vh]">
          <table className="w-full table-auto text-sm text-left border rounded-lg min-w-[500px]">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {Object.keys(tableData[0]).map((key) => (
                  <th
                    key={key}
                    className="px-3 sm:px-4 py-2 capitalize whitespace-nowrap text-gray-700"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  {Object.values(item).map((val, i) => (
                    <td
                      key={i}
                      className="px-3 sm:px-4 py-2 whitespace-nowrap text-gray-600"
                    >
                      {val?.toString()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
  className="cursor-pointer p-4 sm:p-6 rounded-xl shadow hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200"
>
  <h2 className="text-xs sm:text-sm font-medium text-gray-600">{title}</h2>
  <p className="text-xl sm:text-2xl font-bold text-blue-700 mt-1 sm:mt-2">
    {value ?? '—'}
  </p>
</div>

  );
}
