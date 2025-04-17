import React, { useContext, useState, useEffect } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const FarmerLogin = () => {
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
    const savedEmail = localStorage.getItem('farmerEmail');
    const savedPassword = localStorage.getItem('farmerPassword');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password,
        role: 'farmer'
      });

      if (response.data.success) {
        if (rememberMe) {
          localStorage.setItem('farmerEmail', email);
          localStorage.setItem('farmerPassword', password);
        } else {
          localStorage.removeItem('farmerEmail');
          localStorage.removeItem('farmerPassword');
        }
        navigate('/farmer-dashboard');
      } else {
        alert(language === 'en' ? 'Login failed' : 
              language === 'kn' ? 'ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ' :
              'लॉगिन विफल');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      const errorMessage = error.response?.data?.message || 'Login failed';
      alert(language === 'en' ? errorMessage : 
            language === 'kn' ? 'ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ' :
            'लॉगिन विफल');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/reset-password', {
        email: resetEmail,
        phone: resetPhone,
        newPassword,
        role: 'farmer'
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
      console.error('Error resetting password:', error);
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      alert(language === 'en' ? errorMessage : 
            language === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವಿಕೆ ವಿಫಲವಾಗಿದೆ' :
            'पासवर्ड रीसेट विफल');
    }
  };

  return (
    <div className="bg-[url('https://img.freepik.com/free-photo/white-brown-cow-looking-straight-camera-with-herd-cows-pasture-background_181624-22510.jpg?semt=ais_hybrid')] bg-cover bg-center h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-md opacity-80" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', width: '550px', marginTop: '10%', marginRight: '40%' }}>
        <h1 className="text-2xl font-bold mb-4 text-center">
          {language === 'en' && 'Welcome Back!'}
          {language === 'kn' && 'ಮತ್ತೆ ಸ್ವಾಗತ!'}
          {language === 'hi' && 'वापसी पर स्वागत है!'}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center">
            <img src="https://dashboard.iagri.com/Images/User.png" alt="User Icon" className="mr-2" style={{ height: '30px' }} />
            <input type="email" placeholder={language === 'en' ? 'Email' : language === 'kn' ? 'ಇಮೇಲ್' : 'ईमेल'} className="border p-2 w-full" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-4 flex items-center">
            <img src="https://dashboard.iagri.com/Images/Password.png" alt="Password Icon" className="mr-2" style={{ height: '30px' }} />
            <input type="password" placeholder={language === 'en' ? 'Password' : language === 'kn' ? 'ಪಾಸ್ವರ್ಡ್' : 'पासवर्ड'} className="border p-2 w-full" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="mb-4 flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              {language === 'en' && 'Remember me'}
              {language === 'kn' && 'ನನ್ನನ್ನು ನೆನಪಿಡಿ'}
              {language === 'hi' && 'मुझे याद रखें'}
            </label>
            <a href="#" className="text-blue-500" onClick={() => setShowResetModal(true)}>
              {language === 'en' && 'Forgot password?'}
              {language === 'kn' && 'ಪಾಸ್ವರ್ಡ್ ಮರೆತಿರಾ?'}
              {language === 'hi' && 'पासवर्ड भूल गए?'}
            </a>
          </div>
          <div className="mb-4 flex justify-between">
            <Link to="/farmer-signup" className="text-blue-500">
              {language === 'en' && 'Sign up'}
              {language === 'kn' && 'ಸೈನ್ ಅಪ್ ಮಾಡಿ'}
              {language === 'hi' && 'साइन अप करें'}
            </Link>
            <button type="submit" className="bg-green-700 text-white p-2 rounded w-1/4">
              {language === 'en' && 'Enter'}
              {language === 'kn' && 'ಪ್ರವೇಶಿಸಿ'}
              {language === 'hi' && 'प्रवेश करें'}
            </button>
          </div>
        </form>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {language === 'en' && 'Reset Password'}
              {language === 'kn' && 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ'}
              {language === 'hi' && 'पासवर्ड रीसेट करें'}
            </h2>
            <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder={language === 'en' ? 'Email' : language === 'kn' ? 'ಇಮೇಲ್' : 'ईमेल'}
                  className="border p-2 w-full rounded"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="tel"
                  placeholder={language === 'en' ? 'Phone Number' : language === 'kn' ? 'ಫೋನ್ ನಂಬರ' : 'फोन नंबर'}
                  className="border p-2 w-full rounded"
                  value={resetPhone}
                  onChange={(e) => setResetPhone(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  placeholder={language === 'en' ? 'New Password' : language === 'kn' ? 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್' : 'नया पासवर्ड'}
                  className="border p-2 w-full rounded"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="bg-gray-300 text-black p-2 rounded"
                >
                  {language === 'en' ? 'Cancel' : language === 'kn' ? 'ರದ್ದುಮಾಡು' : 'रद्द करें'}
                </button>
                <button
                  type="submit"
                  className="bg-green-700 text-white p-2 rounded"
                >
                  {language === 'en' ? 'Reset' : language === 'kn' ? 'ಮರುಹೊಂದಿಸಿ' : 'रीसेट करें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerLogin;