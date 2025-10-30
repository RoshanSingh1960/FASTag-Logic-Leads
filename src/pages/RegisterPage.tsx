import React, { useState } from 'react';
import { supabase } from '../api/supabase';
import { useNavigate, Link } from 'react-router-dom';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage('Registration successful! Please check your email to verify your account.');
            // You might want to redirect after a delay or on email verification
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-160px)] bg-gradient-to-br from-purple-100 to-pink-200">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md animate-slide-in-up">
                <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Join Logic Leads</h2>
                <form onSubmit={handleRegister} className="space-y-6">
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
                    {message && <p className="text-green-600 text-sm font-medium">{message}</p>}
                    <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                        {loading ? <LoadingSpinner /> : 'Register'}
                    </Button>
                </form>
                <p className="mt-6 text-center text-gray-600">
                    Already have an account? <Link to="/login" className="text-purple-600 hover:underline font-semibold">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;