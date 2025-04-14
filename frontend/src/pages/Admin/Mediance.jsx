import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from "lucide-react";

const AddMediance = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    medianceId: '',
    name: '',
    description: '',
    plantName: '', // Add this new field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const medianceData = {
      medianceId: formData.medianceId,
      name: formData.name,
      plantName: formData.plantName,
      description: formData.description
    };

    try {
      const response = await fetch("http://localhost:3000/api/add_mediance", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(medianceData)
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Success:", data);
        alert('Mediance added successfully!');
        setFormData({
          medianceId: '',
          name: '',
          description: '',
          plantName: ''
        });
      } else {
        console.error("Server response:", data);
        throw new Error(data.error || 'Failed to add mediance');
      }
    } catch (error) {
      console.error("Error details:", error);
      alert(`Error: ${error.message || 'Failed to connect to server'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-screen-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:scale-[1.02]">
          <div className="flex items-center justify-center mb-8">
            <Leaf className="w-8 h-8 text-blue-500 animate-bounce" />
            <h1 className="text-3xl font-bold text-gray-800 ml-3">
              Add Mediance Details
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                name="medianceId"
                value={formData.medianceId}
                onChange={handleChange}
                placeholder="Enter Mediance ID"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none"
                required
              />
            </div>

            <div className="relative">
              <input
                type="text"
                name="plantName"
                value={formData.plantName}
                onChange={handleChange}
                placeholder="Enter Plant Name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none"
                required
              />
            </div>

            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Mediance Name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none"
                required
              />
            </div>

            <div className="relative">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter Description"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none"
                rows="4"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Add Mediance"}
            </button>
          </form>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="text-blue-500 hover:underline"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMediance;