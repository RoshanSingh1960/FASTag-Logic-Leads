import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="relative min-h-[calc(100vh-160px)] bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center overflow-hidden">
            {/* Background animation elements */}
            <div className="absolute inset-0 bg-pattern opacity-10 animate-pulse-slow"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-blob-slow bg-white w-64 h-64 rounded-full mix-blend-multiply filter blur-xl opacity-30 absolute top-1/4 left-1/4"></div>
                <div className="animate-blob-medium bg-blue-300 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 absolute bottom-1/3 right-1/4"></div>
                <div className="animate-blob-fast bg-pink-300 w-56 h-56 rounded-full mix-blend-multiply filter blur-xl opacity-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="relative z-10 text-center text-white p-8 bg-white/20 backdrop-blur-md rounded-xl shadow-2xl max-w-3xl border border-white/30 animate-slide-in-up">
                <h1 className="text-6xl font-extrabold mb-6 leading-tight animate-text-clip">
                    Recharge Your FASTag, Smarter, Faster.
                </h1>
                <p className="text-xl mb-10 text-gray-100 font-light">
                    Experience seamless toll payments with Logic Leads. Manage vehicles, view transactions, and recharge in seconds.
                </p>
                <Link to="/recharge" className="inline-block bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-4 px-10 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300">
                    Recharge FASTag Now
                </Link>

                {/* Benefits Section */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center p-6 bg-white/10 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <svg className="w-16 h-16 text-yellow-300 mb-4 animate-bounce-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        <h3 className="text-xl font-bold mb-2">Instant Recharge</h3>
                        <p className="text-gray-200">Top-up your FASTag in a flash, anytime, anywhere.</p>
                    </div>
                    <div className="flex flex-col items-center p-6 bg-white/10 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <svg className="w-16 h-16 text-teal-300 mb-4 animate-pulse-fast" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
                        <p className="text-gray-200">Your transactions are safe with our encrypted gateway.</p>
                    </div>
                    <div className="flex flex-col items-center p-6 bg-white/10 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <svg className="w-16 h-16 text-orange-300 mb-4 animate-swing" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                        <h3 className="text-xl font-bold mb-2">Vehicle Management</h3>
                        <p className="text-gray-200">Add and manage all your vehicles in one place.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;