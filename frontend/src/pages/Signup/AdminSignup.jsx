import React, { useState, useContext } from 'react';
import axios from 'axios';
import { LanguageContext } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const AdminSignup = () => {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address1: '',
    address2: '',
    suburb: '',
    townCity: '',
    postCode: '',
    phoneNumber: '',
    designation: '',
    id: '',
    role: 'admin'
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 3 || formData.password.length > 8) {
      setMessage('Password must be between 3 and 8 characters.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/signup', formData);
      setMessage('Signup successful! Please login here.');
      setTimeout(() => {
        navigate('/admin-login');
      }, 2000);
    } catch (error) {
      console.error('Error signing up:', error);
      setMessage('Signup failed');
    }
  };

  return (
    <div className="bg-[url('https://www.shutterstock.com/image-photo/banker-officer-making-notes-about-600nw-2287782837.jpg')] bg-cover bg-center h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-md opacity-80" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', width: '550px', marginTop: '10%', marginRight: '40%' }}>
        <h1 className="text-2xl font-bold mb-4 text-center">
          {language === 'en' && 'Admin Signup'}
          {language === 'kn' && 'ನಿರ್ವಾಹಕ ನೋಂದಣಿ'}
          {language === 'hi' && 'प्रशासक पंजीकरण'}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input type="text" name="firstName" placeholder={language === 'en' ? 'First Name' : language === 'kn' ? 'ಮೊದಲ ಹೆಸರು' : 'पहला नाम'} className="border p-2 w-full" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <input type="text" name="lastName" placeholder={language === 'en' ? 'Last Name' : language === 'kn' ? 'ಕೊನೆಯ ಹೆಸರು' : 'अंतिम नाम'} className="border p-2 w-full" value={formData.lastName} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <input type="email" name="email" placeholder={language === 'en' ? 'Email Address' : language === 'kn' ? 'ಇಮೇಲ್ ವಿಳಾಸ' : 'ईमेल पता'} className="border p-2 w-full" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <input type="password" name="password" placeholder={language === 'en' ? 'Password' : language === 'kn' ? 'ಪಾಸ್ವರ್ಡ್' : 'पासवर्ड'} className="border p-2 w-full" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <input type="text" name="address1" placeholder={language === 'en' ? 'Address Line 1' : language === 'kn' ? 'ವಿಳಾಸ ಸಾಲು 1' : 'पता पंक्ति 1'} className="border p-2 w-full" value={formData.address1} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <input type="text" name="address2" placeholder={language === 'en' ? 'Address Line 2' : language === 'kn' ? 'ವಿಳಾಸ ಸಾಲು 2' : 'पता पंक्ति 2'} className="border p-2 w-full" value={formData.address2} onChange={handleChange} />
          </div>
          <div className="mb-4">
            <input type="text" name="suburb" placeholder={language === 'en' ? 'Suburb' : language === 'kn' ? 'ಉಪನಗರ' : 'उपनगर'} className="border p-2 w-full" value={formData.suburb} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <input type="text" name="townCity" placeholder={language === 'en' ? 'Town/City' : language === 'kn' ? 'ನಗರ/ಪಟ್ಟಣ' : 'शहर/कस्बा'} className="border p-2 w-full" value={formData.townCity} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <input type="text" name="postCode" placeholder={language === 'en' ? 'Post Code' : language === 'kn' ? 'ಪಿನ್ ಕೋಡ್' : 'पिन कोड'} className="border p-2 w-full" value={formData.postCode} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <input type="text" name="phoneNumber" placeholder={language === 'en' ? 'Phone Number' : language === 'kn' ? 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ' : 'फोन नंबर'} className="border p-2 w-full" value={formData.phoneNumber} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <input type="text" name="designation" placeholder={language === 'en' ? 'Designation' : language === 'kn' ? 'ಹುದ್ದೆ' : 'पद'} className="border p-2 w-full" value={formData.designation} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <input type="text" name="id" placeholder={language === 'en' ? 'ID Number' : language === 'kn' ? 'ಐಡಿ' : 'आईडी'} className="border p-2 w-full" value={formData.id} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" required />
              {language === 'en' && 'I have read and agree to the terms and conditions'}
              {language === 'kn' && 'ನಾನು ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳನ್ನು ಓದಿದ್ದೇನೆ ಮತ್ತು ಒಪ್ಪುತ್ತೇನೆ'}
              {language === 'hi' && 'मैंने नियम और शर्तें पढ़ ली हैं और सहमत हूं'}
            </label>
          </div>
          <div className="mb-4">
            <button type="submit" className="bg-green-700 text-white p-2 rounded w-full">
              {language === 'en' && 'Sign Up'}
              {language === 'kn' && 'ಸೈನ್ ಅಪ್ ಮಾಡಿ'}
              {language === 'hi' && 'साइन अप करें'}
            </button>
          </div>
        </form>
        {message && <p className="text-center mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default AdminSignup;