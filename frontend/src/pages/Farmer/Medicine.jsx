import React, { useState, useRef, useEffect } from "react";
import { Camera, Upload, Loader2, Leaf } from "lucide-react";
import axios from "axios";

function Plant() {
  const [plantName, setPlantName] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [plantDetails, setPlantDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [medicineData, setMedicineData] = useState([]);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    fetchMedicineData();
  }, []);

  const fetchMedicineData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/display/medicines");
      if (response.data && Array.isArray(response.data.medicines)) {
        setMedicineData(response.data.medicines);
      } else {
        console.error("Invalid data format received:", response.data);
        setMedicineData([]);
      }
    } catch (error) {
      console.error("Error fetching medicine data:", error);
      setMedicineData([]);
    }
  };

  const fetchPlantDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/display/medicine-details",
        { name: plantName }
      );
      
      if (response.data && response.data.medicine) {
        setPlantDetails(
          `Name: ${response.data.medicine.name}\nPlant Name: ${response.data.medicine.plantname}\nDescription: ${response.data.medicine.description}`
        );
      } else {
        setPlantDetails("No details found for this medicine.");
      }
    } catch (error) {
      console.error("Error fetching medicine details:", error);
      setPlantDetails(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-screen-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:scale-[1.02]">
          <div className="flex items-center justify-center mb-8">
            <Leaf className="w-8 h-8 text-emerald-500 animate-bounce" />
            <h1 className="text-3xl font-bold text-gray-800 ml-3">
              Medicine Name
            </h1>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                placeholder="Enter medicine name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 outline-none"
              />
            </div>

            <button
              onClick={fetchPlantDetails}
              className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={(!plantName && !previewImage) || loading} // Disable button while loading
            >
              {loading ? (
                <Loader2 className="w-6 h-6 mx-auto animate-spin" />
              ) : (
                "Enter"
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto">
        {plantDetails && (
          <div className="mt-10 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-emerald-700 mb-6">
              Plant Medicine
            </h2>
            <p className="text-gray-700 whitespace-pre-line">{plantDetails}</p>
          </div>
        )}

        <div className="mt-10 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-emerald-700 mb-6">
            Medicine Database
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-emerald-50">
                <tr>
                  <th className="px-4 py-2 text-left text-emerald-600">Medicine ID</th>
                  <th className="px-4 py-2 text-left text-emerald-600">Name</th>
                  <th className="px-4 py-2 text-left text-emerald-600">Plant Name</th>
                  <th className="px-4 py-2 text-left text-emerald-600">Description</th>
                </tr>
              </thead>
              <tbody>
                {medicineData.map((medicine) => (
                  <tr key={medicine.medicineid} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{medicine.medicineid}</td>
                    <td className="px-4 py-2">{medicine.name}</td>
                    <td className="px-4 py-2">{medicine.plantname}</td>
                    <td className="px-4 py-2">{medicine.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Plant;
