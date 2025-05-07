import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Hook for navigation

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });
            localStorage.setItem('token', res.data.token);
            if(res?.data?.user?.role === 'admin'){
                navigate('/admindashboard');

               
            }else{
               
                navigate('/dashboard');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg flex overflow-hidden">
          {/* Left Side - Logo & Description */}
          <div className="w-1/2 bg-white p-8 flex flex-col justify-center items-center border-r">
            <img
              src="/logo.png" // replace with your logo path
              alt="VNC Logo"
              className="w-24 h-24 mb-4"
            />
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">Welcome to VNC</h2>
            <p className="text-gray-600 text-center">
              Connecting people with technology through innovative and reliable solutions.
            </p>
          </div>
  
          {/* Right Side - Login Form */}
          <div className="w-1/2 p-8">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h2>
            <form onSubmit={handleLogin} className="space-y-5">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex justify-between items-center text-sm text-gray-600">
                <a href="#" className="hover:underline text-blue-600">
                  Forgot Password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Login
              </button>
            </form>
            {message && (
              <p className="mt-4 text-center text-sm text-red-500">{message}</p>
            )}
          </div>
        </div>
      </div>
    );
};

export default Login;
