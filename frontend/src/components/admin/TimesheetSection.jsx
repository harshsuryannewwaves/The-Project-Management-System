import { useEffect, useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  getDay,
  isSameMonth,
  isWeekend,
} from 'date-fns';
import axios from 'axios';

export default function TimesheetCalendarSection() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [days, setDays] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState('present');
  const [reason, setReason] = useState('');
  const [timesheet, setTimesheet] = useState([{ taskName: '', hoursSpent: '' }]);
  const [approved, setApproved] = useState(false);
    const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState('all');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const dayList = eachDayOfInterval({ start, end });
    setDays(dayList);
    fetchAttendanceData();
  }, [currentMonth]);

  const fetchAttendanceData = async () => {
    try {
      const month = format(currentMonth, 'yyyy-MM');
      const res = await axios.get(`http://localhost:5000/api/attendance?month=${month}`, { headers });
      const dataMap = {};
      res.data.forEach(item => {
        const key = format(new Date(item.date), 'yyyy-MM-dd');
        dataMap[key] = item;
      });
      setAttendanceData(dataMap);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    }
  };

  const goToPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const openModal = (date) => {
    const key = format(date, 'yyyy-MM-dd');
    const existing = attendanceData[key];
    setSelectedDate(date);
    setApproved(existing?.approved || false);

    setStatus(existing?.status || 'present');
    setReason(existing?.sickLeaveReason || '');
    setTimesheet(existing?.timesheet?.length ? existing.timesheet : [{ taskName: '', hoursSpent: '' }]);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const addTask = () => setTimesheet([...timesheet, { taskName: '', hoursSpent: '' }]);

  const updateTask = (index, key, value) => {
    const updated = [...timesheet];
    updated[index][key] = value;
    setTimesheet(updated);
  };

  const submitAttendance = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/attendance/create',
        {
          date: selectedDate,
          status,
          sickLeaveReason: reason,
          timesheet: status === 'present' ? timesheet : [],
        },
        { headers }
      );
      alert('Attendance submitted');
      closeModal();
      fetchAttendanceData();
    } catch (err) {
      console.error('Error submitting:', err.message);
    }
  };

  const getLeadingBlankCells = () => {
    const firstDay = getDay(startOfMonth(currentMonth));
    return Array.from({ length: firstDay });
  };

  const getColorForDay = (day) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const record = attendanceData[dateKey];

    if (isWeekend(day)) return 'bg-gray-100 text-gray-500';
    if (!record) return 'bg-white';

    if (record.status === 'absent') return 'bg-red-100 text-red-800';
    if (record.status === 'present') {
      return record.approved ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800';
    }
    return 'bg-white';
  };
  const approveAttendance = async () => {
    try {
      const key = format(selectedDate, 'yyyy-MM-dd');
      const attendanceId = attendanceData[key]?._id;
      if (!attendanceId) return alert('Record not found.');

      await axios.put(
        `http://localhost:5000/api/attendance/${attendanceId}`,
        { approved: true },
        { headers }
      );
      alert('Attendance approved');
      setApproved(true);
      fetchAttendanceData();
    } catch (err) {
      console.error('Approval failed:', err.message);
    }
  };
const filtered = records.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !r.approved;
    if (filter === 'present') return r.status === 'present';
    if (filter === 'absent') return r.status === 'absent';
    return true;
  });
  const approveRecord = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/attendance/${id}`,
        { approved: true },
        { headers }
      );
      alert('Approved successfully');
      fetchData(); // refresh
    } catch (err) {
      console.error('Approve error:', err.message);
    }
  };
const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/attendance', { headers });
      setRecords(res.data);
    } catch (err) {
      console.error('Fetch error:', err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="p-6">
      {role === 'admin'  ? (
        <>
                <h2 className="text-xl font-semibold mb-4">Admin Attendance Approvals</h2>

      <div className="mb-4">
        <label className="mr-2 font-medium">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="all">All</option>
          <option value="pending">Pending Only</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>
      </div>

      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Approved</th>
            <th className="p-2 border">Reason</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r._id} className="border">
              <td className="p-2 border">{format(new Date(r.date), 'yyyy-MM-dd')}</td>
              <td className="p-2 border">{r.user?.name || 'Unknown'}</td>
              <td className="p-2 border capitalize">{r.status}</td>
              <td className="p-2 border">{r.approved ? '✅' : '⏳'}</td>
              <td className="p-2 border">{r.sickLeaveReason || '-'}</td>
              <td className="p-2 border">
                {!r.approved && (
                  <button
                    onClick={() => approveRecord(r._id)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
            </>  ):(
<>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="space-x-2">
          <button onClick={goToPrevMonth} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">⬅️ Prev</button>
          <button onClick={goToNextMonth} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">Next ➡️</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center font-semibold">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 text-center mt-2">
        {getLeadingBlankCells().map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {days.map((day) => (
          <div
            key={day}
            onClick={() => openModal(day)}
            className={`cursor-pointer border rounded-md p-2 hover:bg-blue-100 transition duration-150 ${getColorForDay(day)} ${isSameMonth(day, currentMonth) ? '' : 'text-gray-400'
              }`}
          >
            {format(day, 'd')}
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-md shadow-md w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              Mark Attendance: {format(selectedDate, 'PPP')}
            </h3>

            <label className="block font-medium mb-2">Status</label>
            <select
              className="w-full border px-2 py-1 rounded mb-4"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>

            {status === 'absent' && (
              <div className="mb-4">
                <label className="block font-medium mb-1">Sick Leave Reason</label>
                <textarea
                  className="w-full border px-2 py-1 rounded"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            )}

            {status === 'present' && (
              <div>
                <label className="block font-medium mb-2">Tasks</label>
                {timesheet.map((task, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Task"
                      className="flex-1 border px-2 py-1 rounded"
                      value={task.taskName}
                      onChange={(e) => updateTask(i, 'taskName', e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Hours"
                      className="w-20 border px-2 py-1 rounded"
                      value={task.hoursSpent}
                      onChange={(e) => updateTask(i, 'hoursSpent', e.target.value)}
                    />
                  </div>
                ))}
                <button onClick={addTask} className="text-sm text-blue-600 mb-4">+ Add Task</button>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={submitAttendance}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
            {role === 'admin' && selectedDate && (
              <div className="mt-4 mb-2 flex items-center justify-between">
                <div className="text-sm">
                  Status: {status === 'present' ? (approved ? '✅ Approved' : '⏳ Not Approved') : 'N/A'}
                </div>
                {status === 'present' && !approved && (
                  <button
                    onClick={approveAttendance}
                    className="bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    
           </> )}
           </div>
  );
}
