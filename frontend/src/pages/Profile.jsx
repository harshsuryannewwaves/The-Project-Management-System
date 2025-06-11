import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeftCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL;

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
      .get(`${API_BASE_URL}/api/user/me`, {
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
        `${API_BASE_URL}/api/user/change-password`,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-8 sm:p-10 space-y-8 relative">

        {/* Optional Back Button */}
        {/* <button
          className="absolute top-4 left-4 text-blue-600 hover:text-blue-800"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftCircle size={30} />
        </button> */}

        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-700 mb-1">My Profile</h2>
          <p className="text-gray-500 text-sm">Manage your personal details and update your password</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium">Name</label>
            <div className="text-lg font-semibold text-gray-800">{user.name}</div>
          </div>
          <div>
            <label className="block text-gray-600 font-medium">Email</label>
            <div className="text-lg text-gray-700">{user.email}</div>
          </div>
          {user.role === 'employee' && (
            <div>
              <label className="block text-gray-600 font-medium">Designation</label>
              <div className="text-lg text-gray-700">{user.designation || 'N/A'}</div>
            </div>
          )}
        </div>

        <hr className="border-t border-gray-200" />

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-gray-600 font-medium mb-1">Old Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">New Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Confirm New Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
