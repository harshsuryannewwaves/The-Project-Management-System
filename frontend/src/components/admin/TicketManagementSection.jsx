import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;
export default function TicketManagementSection() {
  const [tickets, setTickets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    project: '',
    assignedTo: '',
    status: 'open',
    image: null
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token') || '';
const role = localStorage.getItem('role') || ''; // example token storage
  const loginName = localStorage.getItem('name') || ''; // example token storage
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  // Fetch data
  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/tickets`, axiosConfig);
      setTickets(res.data);
    } catch (err) {
      console.error('Error fetching tickets');
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/projects`, axiosConfig);
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects');
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/dashboard/employees`, axiosConfig);
      const employeesOnly = res.data.filter((u) => u.role === 'employee');
      setEmployees(employeesOnly);
    } catch (err) {
      console.error('Error fetching users');
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchProjects();
    fetchEmployees();
  }, []);

  const openCreateModal = () => {
    setEditingTicket(null);
    setForm({
      title: '',
      description: '',
      category: '',
      project: '',
      assignedTo: '',
      status: 'open',
      image:''
    });
    setModalOpen(true);
  };

  const openEditModal = (ticket) => {
    setEditingTicket(ticket);
    setForm({
      title: ticket.title,
      description: ticket.description || '',
      category: ticket.category || '',
      project: ticket.project?._id || '',
      assignedTo: ticket.assignedTo?._id || '',
      status: ticket.status || 'open',
      image:ticket.image|| ''
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((f) => ({ ...f, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('category', form.category);
    fd.append('project', form.project);
    fd.append('assignedTo', form.assignedTo);
    fd.append('status', form.status);
    if (form.image) fd.append('image', form.image);

    try {
      if (editingTicket) {
        await axios.put(`${API_BASE_URL}/api/tickets/${editingTicket._id}`, fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setMessage('Ticket updated.');
      } else {
        await axios.post(`${API_BASE_URL}/api/tickets/create`, fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setMessage('Ticket created.');
      }
      setModalOpen(false);
      fetchTickets();
    } catch (err) {
      setMessage('Error saving ticket.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/tickets/${id}`, axiosConfig);
      setMessage('Ticket deleted.');
      fetchTickets();
    } catch (err) {
      setMessage('Error deleting ticket.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Ticket Management</h2>

      {message && (
        <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded">{message}</div>
      )}

      <button
        onClick={openCreateModal}
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        + Create Ticket
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Title</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Assigned To</th>
              <th className="border p-2">Project</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id} className="hover:bg-gray-50">
                <td className="border p-2">{ticket.title}</td>
                <td className="border p-2">{ticket.category}</td>
                <td className="border p-2">{ticket.assignedTo?.name || 'N/A'}</td>
                <td className="border p-2">{ticket.project?.name || 'N/A'}</td>
                <td className="border p-2 capitalize">{ticket.status}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => openEditModal(ticket)}
                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                  >
                    Edit
                  </button>
              {  (role === 'admin' || ticket.createdBy.name === loginName) &&  <button
                    onClick={() => handleDelete(ticket._id)}
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
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">
              {editingTicket ? 'Edit Ticket' : 'Create Ticket'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Title *</label>
                <input
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
                <label className="block mb-1 font-medium">Category *</label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
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
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Assign To</label>
                <select
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select Employee</option>
                  {employees.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>
              <div> <label className="block mb-1 font-medium">Image</label> <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" /> </div>
              {editingTicket?.image && (

                <div className="mb-2"> <img src={editingTicket.image} alt="ticket" className="w-32 h-auto rounded" /> </div>)}
              <div className="flex justify-end gap-2">
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
                  {editingTicket ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
