import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import First from './pages/First';
import FarmerLogin from './pages/Login/FarmerLogin';
import AdminLogin from './pages/Login/AdminLogin';
import Signup from './pages/Signup/Signup';
import AdminSignup from './pages/Signup/AdminSignup';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import FarmerDashboard from './pages/Dashboard/FarmerDashboard';
import FarmerSignup from './pages/Signup/Signup';
import { LanguageProvider, LanguageContext } from './context/LanguageContext';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <ConditionalHeader />
        <ConditionalNavbar />
        <Routes>
          <Route path="/" element={< Home/>} />
          <Route path="/farmer-login" element={<FarmerLogin />} />
          
          <Route path="/admin-login" element={<AdminLogin />} />
       
          <Route path="/farmer-signup" element={<FarmerSignup />} />
          <Route path="/admin-signup" element={<AdminSignup />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
          
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

const Header = () => {
  const { language, setLanguage } = useContext(LanguageContext);

  return (
    <header className="bg-green-700 p-4 flex justify-between items-center">
      <h1 className="text-white text-4xl font-bold ml-4">
        COMPLETE FARM MANAGEMENT FROM ONE EASY-TO-USE DASHBOARD
      </h1>
      <div className="text-white mr-4">
        <select
          className="bg-green-700 border border-white rounded p-2"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          >
          <option value="en">English</option>
          <option value="kn">ಕನ್ನಡ</option>
          <option value="hi">हिन्दी</option>
        </select>
      </div>
          </header>
  );
};

const ConditionalHeader = () => {
  const location = useLocation();
  return location.pathname !== '/farmer-login' && location.pathname !== '/student-login' && location.pathname !== '/admin-login' ? <Header /> : null;
};

const ConditionalNavbar = () => {
  const location = useLocation();
  return location.pathname !== '/farmer-login' && location.pathname !== '/student-login' && location.pathname !== '/admin-login' ? <Navbar /> : null;
};

export default App;

// https://serpapi.com/search.json?engine=google_lens&url=https://i.imgur.com/HBrB8p0.png