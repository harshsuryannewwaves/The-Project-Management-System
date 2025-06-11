import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { SplineScene } from "@/components/ui/splineScene";
import { Spotlight } from "@/components/ui/spotlight";
import { Card } from "@/components/ui/card";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
                email,
                password,
            });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role);
            localStorage.setItem('name', res.data.user.name);
            if (res?.data?.user?.role === 'admin') {
                navigate('/admindashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl bg-white/30 rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden backdrop-blur-md">
                
                {/* 3D Section - hidden on small screens */}
                <div className="hidden md:block md:w-2/3">
                    <Card className="h-full w-full bg-black/[0.96] rounded-none">
                        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
                        <div className="h-full w-full">
                            <SplineScene
                                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                                className="w-full h-[500px] md:h-full"
                            />
                        </div>
                    </Card>
                </div>

                {/* Login Form */}
                <div className="w-full md:w-1/3 p-8 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold text-black">VNConnect</h1>
                        <p className="text-sm mt-2 text-black">Centralized hub for all work/project management</p>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Login</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
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
                            <Link to="/forgot-password" className="text-blue-600 hover:underline">
                                Forgot your password?
                            </Link>
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
