import React, { useState, useEffect } from "react";
import { Leaf, Loader2 } from "lucide-react";
import axios from "axios";

function Methods() {
  const [plantName, setPlantName] = useState("");
  const [loading, setLoading] = useState(false);
  const [methods, setMethods] = useState([]);
  const [error, setError] = useState(null);

  const fetchMethods = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        plantName
          ? `http://localhost:3000/api/display/methods/${encodeURIComponent(plantName)}`
          : "http://localhost:3000/api/display/methods"
      );
      if (response.data && response.data.length === 0) {
        setError("No methods found for the specified plant.");
      }
      setMethods(response.data);
    } catch (error) {
      console.error("Error fetching methods:", error);
      setError("Failed to fetch methods. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch all methods initially
    fetchMethods();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchMethods();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-screen-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:scale-[1.02]">
          <div className="flex items-center justify-center mb-8">
            <Leaf className="w-8 h-8 text-emerald-500 animate-bounce" />
            <h1 className="text-3xl font-bold text-gray-800 ml-3">
              Farming Methods
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                placeholder="Enter plant name (leave empty for all methods)"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-6 h-6 mx-auto animate-spin" />
              ) : (
                "Search Methods"
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="mt-10 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-emerald-700 mb-6">
            {plantName ? `Methods for ${plantName}` : "All Farming Methods"}
          </h2>
          {methods.length > 0 ? (
            <div className="space-y-6">
              {methods.map((method, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <h3 className="text-xl font-semibold text-emerald-600 mb-2">
                    {method.name}
                  </h3>
                  <p className="text-gray-600 mb-2">Plant: {method.plant_name}</p>
                  <p className="text-gray-700 whitespace-pre-line">
                    {method.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No methods found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Methods;
