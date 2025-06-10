import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeftCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/user/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => setUser(res.data))
      .catch(console.error);
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const { oldPassword, newPassword, confirmPassword } = passwordForm;

      const res = await axios.put(
        'http://localhost:5000/api/user/change-password',
        { oldPassword, newPassword, confirmPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      alert(res.data.message);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-8 relative mt-10">
      
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">My Profile</h2>

        {/* View-Only Info */}
        <div className="mb-4">
          <label className="text-gray-600 font-medium">Name:</label>
          <p className="text-lg font-semibold">{user.name}</p>
        </div>
        <div className="mb-4">
          <label className="text-gray-600 font-medium">Email:</label>
          <p className="text-lg">{user.email}</p>
        </div>
        {user.role === 'employee' && (
          <div className="mb-4">
            <label className="text-gray-600 font-medium">Designation:</label>
            <p className="text-lg">{user.designation || 'N/A'}</p>
          </div>
        )}

        {/* Password Update */}
        <hr className="my-6" />
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Change Password</h3>
        <form onSubmit={handlePasswordChange}>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-1">Old Password</label>
            <input
              type="password"
              className="w-full border rounded px-4 py-2"
              value={passwordForm.oldPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-1">New Password</label>
            <input
              type="password"
              className="w-full border rounded px-4 py-2"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              className="w-full border rounded px-4 py-2"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
