import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../api/supabase";

const Header = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) console.error("Logout error:", error);
            navigate("/login");
            localStorage.removeItem("supabase.auth.token");
        } catch (err) {
            console.error("Logout failed:", err);
            localStorage.clear();
            navigate("/login");
        }
    };

    if (loading) return (
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-lg">
            <nav className="container mx-auto flex justify-between items-center">
                <div className="text-3xl font-bold tracking-wide">Logic Leads</div>
                <div className="flex space-x-4">
                    <div className="w-20 h-8 bg-blue-500 rounded animate-pulse"></div>
                </div>
            </nav>
        </header>
    );

    return (
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-lg">
            <nav className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-3xl font-bold tracking-wide hover:scale-105 transition-transform duration-300">Logic Leads</Link>
                <ul className="flex space-x-6 items-center">
                    <li><Link to="/" className="hover:text-blue-200 transition-colors duration-300">Home</Link></li>
                    {user ? (
                        <>
                            <li><Link to="/dashboard" className="hover:text-blue-200 transition-colors duration-300">Dashboard</Link></li>
                            <li><Link to="/recharge" className="hover:text-blue-200 transition-colors duration-300">Recharge</Link></li>
                            <li><Link to="/profile" className="hover:text-blue-200 transition-colors duration-300">Profile</Link></li>
                            <li><button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105">Logout</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/how-it-works" className="hover:text-blue-200 transition-colors duration-300">How it Works</Link></li>
                            <li><Link to="/contact" className="hover:text-blue-200 transition-colors duration-300">Contact Us</Link></li>
                            <li><Link to="/login" className="bg-blue-800 hover:bg-blue-900 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105">Login</Link></li>
                            <li><Link to="/register" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105">Register</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
