import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SplineScene } from "@/components/ui/splineScene";
import { Spotlight } from "@/components/ui/spotlight";
import { Card } from "@/components/ui/card";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });
            localStorage.setItem('token', res.data.token);
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
        <div className="h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center ">
            <div className="w-full bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-2xl shadow-lg flex overflow-hidden">

                {/* Left 3D Section */}
                <div className="w-2/3 p-0 relative hidden md:block">
                    <Card className="w-auto h-screen bg-black/[0.96] relative overflow-hidden rounded-none">
                        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
                        <div className="flex h-full">
                            {/* Left text content */}

                            {/* Right 3D visual */}
                            <div className="flex-1 relative">
                                <SplineScene
                                    scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                                    className="w-full h-full"
                                />
                            </div>
                        </div>
                    </Card>
                </div>


                {/* Right Login Form */}
                <div className="w-1/3 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-8">
                    <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-black text-center">
                            VNC
                        </h1>
                        <p className="mt-4 text-black max-w-lg text-center">
                            Connecting people with technology through innovative and reliable solutions.
                        </p>
                    </div>
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
