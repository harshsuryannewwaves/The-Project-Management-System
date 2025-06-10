import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TaskManagementSection() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]); // to select assignees
  const [projects, setProjects] = useState([]); // to select projects
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Modal state for create/edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Form state for create/edit
  const [form, setForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    project: '',
    status: 'assigned'
  });

  // Auth token - replace with your auth logic
  const token = localStorage.getItem('token') || ''; // example token storage
  const role = localStorage.getItem('role') || ''; // example token storage
  const loginName = localStorage.getItem('name') || ''; // example token storage

  // Common axios config with Auth header
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/tasks`, axiosConfig);
      setTasks(res.data);
    } catch (err) {
      setMessage('Error fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users for assigning tasks
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/dashboard/employees`, axiosConfig);
      setUsers(res.data);
    } catch (err) {
      // fail silently
    }
  };

  // Fetch projects for assigning tasks
  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/projects`, axiosConfig);
      setProjects(res.data);
    } catch (err) {
      // fail silently
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
    fetchProjects();
  }, []);

  // Open modal for new task
  const openCreateModal = () => {
    setForm({
      title: '',
      description: '',
      assignedTo: '',
      project: '',
      status: 'assigned'
    });
    setEditingTask(null);
    setModalOpen(true);
  };

  // Open modal for edit task
  const openEditModal = (task) => {
    setForm({
      title: task.title,
      description: task.description || '',
      assignedTo: task.assignedTo?._id || '',
      project: task.project?._id || '',
      status: task.status || 'assigned'
    });
    setEditingTask(task);
    setModalOpen(true);
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.assignedTo) {
      setMessage('Title and Assigned To are required');
      return;
    }

    try {
      if (editingTask) {
        // update
        await axios.put(`${API_BASE_URL}/api/tasks/${editingTask._id}`, form, axiosConfig);
        setMessage('Task updated successfully');
      } else {
        // create
        await axios.post(`${API_BASE_URL}/api/tasks/create`, form, axiosConfig);
        setMessage('Task created successfully');
      }
      setModalOpen(false);
      fetchTasks();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error saving task');
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/tasks/${id}`, axiosConfig);
      setMessage('Task deleted');
      fetchTasks();
    } catch (err) {
      setMessage('Error deleting task');
    }
  };
console.log(tasks)
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Task Management</h2>

      {message && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{message}</div>
      )}

      <button
        onClick={openCreateModal}
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        + Create Task
      </button>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Title</th>
              <th className="border border-gray-300 p-2">Assigned To</th>
              <th className="border border-gray-300 p-2">Project</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{task.title}</td>
                <td className="border border-gray-300 p-2">{task.assignedTo?.name || 'N/A'}</td>
                <td className="border border-gray-300 p-2">{task.project?.name || 'N/A'}</td>
                <td className="border border-gray-300 p-2 capitalize">{task.status}</td>
                <td className="border border-gray-300 p-2 space-x-2">
                  <button
                    onClick={() => openEditModal(task)}
                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                  >
                    Edit
                  </button>
                  {(role === 'admin' || task.assignedBy.name === loginName) && <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">{editingTask ? 'Edit Task' : 'Create Task'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Title*</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows="3"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Assign To*</label>
                <select
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                >
                  <option value="">Select User</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Project</label>
                <select
                  name="project"
                  value={form.project}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select Project</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {editingTask && (
                <div>
                  <label className="block mb-1 font-medium">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="assigned">Assigned</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editingTask ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
