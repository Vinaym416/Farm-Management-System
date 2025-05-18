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
  const [alertMessage, setAlertMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, postCode, phoneNumber, designation, id } = formData;

    if (!firstName || !lastName || !email || !password || !postCode || !phoneNumber || !designation || !id) {
      setAlertMessage(language === 'en' ? 'All fields are required.' :
                      language === 'kn' ? 'ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಬೇಕು.' :
                      'सभी फ़ील्ड भरना अनिवार्य है।');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setAlertMessage(language === 'en' ? 'Invalid email address.' :
                      language === 'kn' ? 'ಅಮಾನ್ಯ ಇಮೇಲ್ ವಿಳಾಸ.' :
                      'अमान्य ईमेल पता।');
      return false;
    }

    if (password.length < 3 || password.length > 8) {
      setAlertMessage(language === 'en' ? 'Password must be between 3 and 8 characters.' :
                      language === 'kn' ? 'ಪಾಸ್ವರ್ಡ್ 3 ರಿಂದ 8 ಅಕ್ಷರಗಳ ನಡುವೆ ಇರಬೇಕು.' :
                      'पासवर्ड 3 से 8 वर्णों के बीच होना चाहिए।');
      return false;
    }

    if (!/^\d{6}$/.test(postCode)) {
      setAlertMessage(language === 'en' ? 'Post code must be exactly 6 digits.' :
                      language === 'kn' ? 'ಪೋಸ್ಟ್ ಕೋಡ್ 6 ಅಂಕೆಗಳಾಗಿರಬೇಕು.' :
                      'पोस्ट कोड ठीक 6 अंकों का होना चाहिए।');
      return false;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      setAlertMessage(language === 'en' ? 'Phone number must be exactly 10 digits.' :
                      language === 'kn' ? 'ಫೋನ್ ಸಂಖ್ಯೆ 10 ಅಂಕೆಗಳಾಗಿರಬೇಕು.' :
                      'फोन नंबर ठीक 10 अंकों का होना चाहिए।');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:3000/signup', formData);
      setAlertMessage(language === 'en' ? 'Signup successful! Please login here.' :
                      language === 'kn' ? 'ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ! ದಯವಿಟ್ಟು ಇಲ್ಲಿ ಲಾಗಿನ್ ಮಾಡಿ.' :
                      'साइनअप सफल हुआ! कृपया यहां लॉगिन करें।');
      setTimeout(() => {
        navigate('/admin-login');
      }, 2000);
    } catch (error) {
      console.error('Error signing up:', error);
      setAlertMessage(language === 'en' ? 'Signup failed. Please try again.' :
                      language === 'kn' ? 'ನೋಂದಣಿ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.' :
                      'साइनअप विफल हुआ। कृपया पुनः प्रयास करें।');
    }
  };

  return (
    <div className="bg-[url('https://www.shutterstock.com/image-photo/banker-officer-making-notes-about-600nw-2287782837.jpg')] bg-cover bg-center h-screen flex justify-center items-center">
      {/* Alert Message at the Top */}
      <div className="absolute top-0 right-0 p-4">
        {alertMessage && (
          <div className="bg-red-500 text-white text-center py-2 rounded">
            {alertMessage}
          </div>
        )}
      </div>

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
      </div>
    </div>
  );
};

export default AdminSignup;