import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Signup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [title, setTitle] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    farmName: '',
    email: '',
    password: '',
    address1: '',
    address2: '',
    suburb: '',
    townCity: '',
    postCode: '',
    phoneNumber: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (location.pathname === '/student-signup') {
      setRole('student');
      setTitle('Student Signup');
    } else if (location.pathname === '/farmer-signup') {
      setRole('farmer');
      setTitle('Farmer Signup');
    }
  }, [location.pathname]);

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
      const response = await axios.post('http://localhost:3000/signup', {
        ...formData,
        role,
      });
      setMessage('Signup successful! Please login here.');
      setTimeout(() => {
        navigate('/farmer-login#');
      }, 2000);
    } catch (error) {
      console.error('Error signing up:', error);
      setMessage('Signup failed');
    }
  };

  const backgroundImage = role === 'farmer'
    ? 'https://img.freepik.com/free-photo/white-brown-cow-looking-straight-camera-with-herd-cows-pasture-background_181624-22510.jpg?semt=ais_hybrid'
    : 'https://vidhilegalpolicy.in/wp-content/uploads/2020/08/1280px-Paddy_field_in_Karnataka_India_2014.jpg';

  return (
    <div className={`bg-[url('${backgroundImage}')] bg-cover bg-center h-screen flex justify-center items-center`}>
      <div className="bg-white p-8 rounded shadow-md opacity-80" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', width: '550px', marginTop: '10%', marginRight: '40%' }}>
        <h1 className="text-2xl font-bold mb-4 text-center">{title}</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input type="text" name="firstName" placeholder="First Name" className="border p-2 w-full" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <input type="text" name="lastName" placeholder="Last Name" className="border p-2 w-full" value={formData.lastName} onChange={handleChange} required />
          </div>
          {role === 'farmer' && (
            <div className="mb-4">
              <input type="text" name="farmName" placeholder="Farm Name" className="border p-2 w-full" value={formData.farmName} onChange={handleChange} required />
            </div>
          )}
          <div className="mb-4">
            <input type="email" name="email" placeholder="Email Address" className="border p-2 w-full" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <input type="password" name="password" placeholder="Password" className="border p-2 w-full" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <input type="text" name="address1" placeholder="Address Line 1" className="border p-2 w-full" value={formData.address1} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <input type="text" name="address2" placeholder="Address Line 2" className="border p-2 w-full" value={formData.address2} onChange={handleChange} />
          </div>
          <div className="mb-4">
            <input type="text" name="suburb" placeholder="Suburb" className="border p-2 w-full" value={formData.suburb} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <input type="text" name="townCity" placeholder="Town/City" className="border p-2 w-full" value={formData.townCity} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <input type="text" name="postCode" placeholder="Post Code" className="border p-2 w-full" value={formData.postCode} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <input type="text" name="phoneNumber" placeholder="Phone Number" className="border p-2 w-full" value={formData.phoneNumber} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" required />
              I have read and agree to the terms and conditions
            </label>
          </div>
          <div className="mb-4">
            <button type="submit" className="bg-green-700 text-white p-2 rounded w-full">Sign Up</button>
          </div>
        </form>
        {message && <p className="text-center mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default Signup;