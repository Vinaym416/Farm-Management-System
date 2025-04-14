import React, { useState } from "react";
import { Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Addplant() {
  const [plantId, setPlantId] = useState("");
  const [plantName, setPlantName] = useState("");
  const [description, setDescription] = useState("");
  const [soilType, setSoilType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const plantData = {
      plant_id: plantId,
      name: plantName,
      description,
      soil_type: soilType
    };

    try {
      console.log("Sending data:", plantData);

      const response = await fetch("http://localhost:3000/api/add_plant", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(plantData)
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Success:", data);
        alert("Plant added successfully!");
        
        // Clear form
        setPlantId("");
        setPlantName("");
        setDescription("");
        setSoilType("");
      } else {
        throw new Error(data.message || 'Failed to add plant');
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
              Add Plant Details
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={plantId}
                onChange={(e) => setPlantId(e.target.value)}
                placeholder="Enter Plant ID"
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
                placeholder="Enter Plant Description"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 outline-none"
                rows="4"
                required
              />
            </div>

            <div className="relative">
              <input
                type="text"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                placeholder="Enter Soil Type"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Add Plant"}
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

export default Addplant;