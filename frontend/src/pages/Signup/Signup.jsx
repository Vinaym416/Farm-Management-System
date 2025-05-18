import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { email, password, phoneNumber, postCode } = formData;

    if (!/^\d{10}$/.test(phoneNumber)) {
      setMessage('Phone number must be exactly 10 digits.');
      return false;
    }

    if (!/^\d{6}$/.test(postCode)) {
      setMessage('Post code must be exactly 6 digits.');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage('Please enter a valid email address.');
      return false;
    }

    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setMessage('Password must be at least 8 characters long and include both letters and numbers.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:3000/signup', {
        ...formData,
        role: 'farmer',
      });
      setMessage('Signup successful! Please login here.');
      setTimeout(() => {
        navigate('/farmer-login');
      }, 2000);
    } catch (error) {
      console.error('Error signing up:', error);
      setMessage('Signup failed. Please try again.');
    }
  };

  return (
    <div className="relative h-screen flex justify-center items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-photo/white-brown-cow-looking-straight-camera-with-herd-cows-pasture-background_181624-22510.jpg?semt=ais_hybrid')",
          filter: 'brightness(0.7)',
          zIndex: 0,
        }}
      />

      {/* Alert Message */}
      <div className="absolute top-0 left-0 w-full p-4 z-10">
        {message && (
          <div className="bg-red-500 text-white text-center py-2 rounded">
            {message}
          </div>
        )}
      </div>
     <div className="absolute top-0 right-0 w-full p-4 z-10">
      {/* Signup Form */}
      <div
        className="bg-white p-8 rounded shadow-md opacity-90 z-10  "
        style={{
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          width: '550px',
        }}
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Farmer Signup</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="border p-2 w-full"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="border p-2 w-full"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="farmName"
              placeholder="Farm Name"
              className="border p-2 w-full"
              value={formData.farmName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="border p-2 w-full"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="border p-2 w-full"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="address1"
              placeholder="Address Line 1"
              className="border p-2 w-full"
              value={formData.address1}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="address2"
              placeholder="Address Line 2"
              className="border p-2 w-full"
              value={formData.address2}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="suburb"
              placeholder="Suburb"
              className="border p-2 w-full"
              value={formData.suburb}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="townCity"
              placeholder="Town/City"
              className="border p-2 w-full"
              value={formData.townCity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="postCode"
              placeholder="Post Code"
              className="border p-2 w-full"
              value={formData.postCode}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              className="border p-2 w-full"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" required />
              I have read and agree to the terms and conditions
            </label>
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="bg-green-700 text-white p-2 rounded w-full"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Signup;