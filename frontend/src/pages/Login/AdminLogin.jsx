import React, { useContext, useState, useEffect } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const { language } = useContext(LanguageContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetPhone, setResetPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('adminEmail');
    const savedPassword = localStorage.getItem('adminPassword');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        alert(language === 'en' ? 'Please fill in all fields' : 
              language === 'kn' ? 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ' :
              'कृपया सभी फ़ील्ड भरें');
        return;
      }

      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password,
        role: 'admin'
      });

      if (response.data.success) {
        if (rememberMe) {
          localStorage.setItem('adminEmail', email);
          localStorage.setItem('adminPassword', password);
        } else {
          localStorage.removeItem('adminEmail');
          localStorage.removeItem('adminPassword');
        }

        navigate('/admin-dashboard');
      } else {
        alert(language === 'en' ? 'Login failed' : 
              language === 'kn' ? 'ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ' :
              'लॉगिन विफल');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Invalid credentials';
      alert(language === 'en' ? errorMessage : 
            language === 'kn' ? 'ಅಮಾನ್ಯ ರುಜುವಾತುಗಳು' :
            'अमान्य क्रेडेंशियल्स');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      if (!resetEmail || !resetPhone || !newPassword) {
        alert(language === 'en' ? 'Please fill in all fields' : 
              language === 'kn' ? 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ' :
              'कृपया सभी फ़ील्ड भरें');
        return;
      }

      const response = await axios.post('http://localhost:3000/api/auth/reset-password', {
        email: resetEmail,
        phone: resetPhone,
        role: 'admin',
        newPassword
      });

      if (response.data.success) {
        alert(language === 'en' ? 'Password reset successful!' : 
              language === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವಿಕೆ ಯಶಸ್ವಿಯಾಗಿದೆ!' :
              'पासवर्ड रीसेट सफल रहा!');
        setShowResetModal(false);
        setResetEmail('');
        setResetPhone('');
        setNewPassword('');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      alert(language === 'en' ? errorMessage : 
            language === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವಿಕೆ ವಿಫಲವಾಗಿದೆ' :
            'पासवर्ड रीसेट विफल');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex  items-center p-4">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-photo/white-brown-cow-looking-straight-camera-with-herd-cows-pasture-background_181624-22510.jpg?semt=ais_hybrid')",
          filter: 'brightness(0.7)',
          zIndex: 0,
        }}
      />
      <div className="relative z-10 bg-white p-8 rounded-2xl shadow-xl opacity-90 transform transition-all duration-500 hover:scale-[1.02] w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {language === 'en' && 'Welcome Back, Admin!'}
          {language === 'kn' && 'ಮತ್ತೆ ಸ್ವಾಗತ, ನಿರ್ವಾಹಕ!'}
          {language === 'hi' && 'वापसी पर स्वागत है, प्रशासक!'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              placeholder={language === 'en' ? 'Email' : language === 'kn' ? 'ಇಮೇಲ್' : 'ईमेल'}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder={language === 'en' ? 'Password' : language === 'kn' ? 'ಪಾಸ್ವರ್ಡ್' : 'पासवर्ड'}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center text-gray-600">
              <input
                type="checkbox"
                className="mr-2"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              {language === 'en' && 'Remember me'}
              {language === 'kn' && 'ನನ್ನನ್ನು ನೆನಪಿಡಿ'}
              {language === 'hi' && 'मुझे याद रखें'}
            </label>
            <button
              type="button"
              className="text-emerald-500 hover:underline"
              onClick={() => setShowResetModal(true)}
            >
              {language === 'en' && 'Forgot password?'}
              {language === 'kn' && 'ಪಾಸ್ವರ್ಡ್ ಮರೆತಿರಾ?'}
              {language === 'hi' && 'पासवर्ड भूल गए?'}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transform transition-all duration-300 hover:scale-[1.02]"
          >
            {language === 'en' && 'Enter'}
            {language === 'kn' && 'ಪ್ರವೇಶಿಸಿ'}
            {language === 'hi' && 'प्रवेश करें'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/admin-signup" className="text-emerald-500 hover:underline">
            {language === 'en' && 'Sign up'}
            {language === 'kn' && 'ಸೈನ್ ಅಪ್ ಮಾಡಿ'}
            {language === 'hi' && 'साइन अप करें'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;