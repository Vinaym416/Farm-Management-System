import React, { useState } from "react";
import { Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AddMethod() {
  const [methodName, setMethodName] = useState("");
  const [plantName, setPlantName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const methodData = {
      name: methodName,
      plant_name: plantName,
      description,
    };

    try {
      const response = await fetch("http://localhost:3000/api/add_method", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(methodData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Success:", data);
        alert("Method added successfully!");
        
        // Clear form
        setMethodName("");
        setPlantName("");
        setDescription("");
      } else {
        throw new Error(data.message || 'Failed to add method');
      }
    } catch (error) {
      console.error("Error details:", error);
      alert(`Error: ${error.message || 'Failed to connect to server'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-screen-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:scale-[1.02]">
          <div className="flex items-center justify-center mb-8">
            <Leaf className="w-8 h-8 text-emerald-500 animate-bounce" />
            <h1 className="text-3xl font-bold text-gray-800 ml-3">
              Add Method Details
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={methodName}
                onChange={(e) => setMethodName(e.target.value)}
                placeholder="Enter Method Name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 outline-none"
                required
              />
            </div>

            <div className="relative">
              <input
                type="text"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                placeholder="Enter Plant Name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 outline-none"
                required
              />
            </div>

            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Method Description"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 outline-none"
                rows="4"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Add Method"}
            </button>
          </form>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="text-emerald-500 hover:underline"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddMethod;