import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white p-6 text-center mt-auto">
            <div className="container mx-auto">
                <p>&copy; {new Date().getFullYear()} Logic Leads. All rights reserved.</p>
                <div className="flex justify-center space-x-4 mt-2">
                    <a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a>
                    <a href="/terms" className="text-gray-400 hover:text-white">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;