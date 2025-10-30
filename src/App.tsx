import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import RechargePage from './pages/RechargePage';
import ProfilePage from './pages/ProfilePage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AuthProvider from './context/AuthContext'; 

function App() {
  return (
    <Router>
      <AuthProvider> {/* Wrap with AuthProvider for session management */}
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/recharge" element={<RechargePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              {/* Add a 404 page later */}
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;