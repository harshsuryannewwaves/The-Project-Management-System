import React, { useState, useEffect } from 'react';

export default function ProjectManagementSection() {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    endTime: '',
    file: null,
  });

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchEmployees();
    checkRole();
  }, []);

  const checkRole = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setIsAdmin(payload?.role === 'admin');
    }
  };

  const fetchProjects = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('https://the-project-management-system-backend.onrender.com/api/projects', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    setProjects(data);
  };

  const fetchEmployees = async () => {
    const res = await fetch('https://the-project-management-system-backend.onrender.com/api/dashboard/employees');
    const data = await res.json();
    setEmployees(data);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, file: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleMember = (id) => {
    setSelectedMembers(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('description', formData.description);
    payload.append('endTime', formData.endTime);
    if (formData.file) payload.append('file', formData.file);
    selectedMembers.forEach(id => payload.append('assignedMembers', id));

    const res = await fetch('https://the-project-management-system-backend.onrender.com/api/projects/create', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: payload,
    });

    if (res.ok) {
      alert('Project created successfully');
      setFormData({ name: '', description: '', endTime: '', file: null });
      setSelectedMembers([]);
      fetchProjects();
      setIsModalOpen(false);
    } else {
      const err = await res.json();
      alert('Error: ' + err.error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Management</h2>

      {isAdmin && (
        <>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 mb-4 rounded"
          >
            + Create Project
          </button>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/40 z-40 flex justify-center items-center">
              <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 rounded shadow-lg relative z-50">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-2 right-3 text-5xl text-gray-500"
                >
                  &times;
                </button>
                <h3 className="text-lg font-bold mb-4">Create New Project</h3>
                <form onSubmit={handleSubmit}>
                  <label className="block mb-2">Project Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Project Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border p-2 mb-3 w-full"
                    required
                  />

                  <label className="block mb-2">Description</label>
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    className="border p-2 mb-3 w-full"
                  />

                  <label className="block mb-2">End Time</label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="border p-2 mb-3 w-full"
                    required
                  />

                  <label className="block mb-2">Upload File</label>
                  <input
                    type="file"
                    name="file"
                    onChange={handleChange}
                    className="border p-2 mb-3 w-full"
                  />

                  <label className="block mb-2">Assign Members</label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 mb-2">
                    {employees.map(emp => (
                      <div
                        key={emp._id}
                        onClick={() => toggleMember(emp._id)}
                        className={`cursor-pointer px-2 py-1 rounded border ${selectedMembers.includes(emp._id)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                      >
                        {emp.name} ({emp.email})
                      </div>
                    ))}
                  </div>

                  <div className="mb-3">
                    <strong>Selected Members:</strong>{' '}
                    {selectedMembers.length > 0 ? selectedMembers.join(', ') : 'None'}
                  </div>

                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      <h3 className="text-lg font-bold mb-4">Projects</h3>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-5 gap-4 font-semibold text-gray-700 border-b pb-2">
            <div>Project Name</div>
            <div>Description</div>
            <div>End Date</div>
            <div>File</div>
            <div>Members</div>
          </div>

          {projects.map(project => (
            <div
              key={project._id}
              className="grid grid-cols-5 gap-4 py-4 border-b text-sm bg-white"
            >
              <div className="font-medium">{project.name}</div>
              <div>{project.description}</div>
              <div>{new Date(project.endTime).toLocaleString()}</div>
              <div>
                {project.file ? (
                  <a
                    href={`https://the-project-management-system-backend.onrender.com${project.file}`}
                    download
                    className="text-blue-600 hover:underline"
                  >
                    Download File
                  </a>
                ) : (
                  'N/A'
                )}
              </div>
              <div>
                <ul className="list-disc ml-4">
                  {project.assignedMembers.map(member => (
                    <li key={member._id}>
                      {member.name} ({member.email})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
