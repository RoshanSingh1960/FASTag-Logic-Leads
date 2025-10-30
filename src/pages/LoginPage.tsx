import React, { useState } from 'react';
import { supabase } from '../api/supabase';
import { useNavigate, Link } from 'react-router-dom';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            navigate('/dashboard'); // Redirect to dashboard on successful login
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-160px)] bg-gradient-to-br from-blue-100 to-indigo-200">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md animate-slide-in-up">
                <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Login to Logic Leads</h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <InputField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="your@email.com"
                    />
                    <InputField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="********"
                    />
                    {error && <p className="text-red-600 text-sm font-medium animate-pulse">{error}</p>}
                    <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                        {loading ? <LoadingSpinner /> : 'Login'}
                    </Button>
                </form>
                <p className="mt-6 text-center text-gray-600">
                    Don't have an account? <Link to="/register" className="text-blue-600 hover:underline font-semibold">Register</Link>
                </p>
                <p className="mt-2 text-center text-gray-600">
                    <Link to="/forgot-password" className="text-blue-600 hover:underline text-sm">Forgot Password?</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;