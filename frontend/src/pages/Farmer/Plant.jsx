import React, { useState, useRef } from "react";
import { Camera, Upload, Loader2, Leaf } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Plant() {
  const [plantName, setPlantName] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [plantDetails, setPlantDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg");
      setPreviewImage(imageData);
      setShowCamera(false);
      const stream = videoRef.current.srcObject;
      if (stream instanceof MediaStream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const fetchPlantDetails = async () => {
    console.log("Starting fetchPlantDetails...");
    setLoading(true);
    try {
      if (previewImage && fileInputRef.current && fileInputRef.current.files.length > 0) {
        console.log("Image upload detected. Preparing to send image to server...");
        const formData = new FormData();
        const file = fileInputRef.current.files[0];

        if (!file) {
          alert("Please upload a valid image.");
          setLoading(false);
          return;
        }

        formData.append("image", file);

        const response = await axios.post(
          "http://127.0.0.1:5000/caption_image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.caption) {
          setPlantDetails(response.data.caption);
        } else {
          throw new Error("Failed to fetch plant details from the image.");
        }
      } else if (plantName) {
        console.log("Plant name entered. Sending name to server...");
        const response = await axios.post(
          "http://127.0.0.1:5000/describe_plant",
          { plant_name: plantName }
        );

        if (response.data.description) {
          setPlantDetails(response.data.description);
        } else {
          throw new Error("Failed to fetch plant details from the name.");
        }
      } else {
        alert("Please provide a plant name or upload an image.");
      }
    } catch (error) {
      console.error("Error fetching plant details:", error);
      alert("An error occurred while fetching plant details. Please try again.");
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
              Plant Diary
            </h1>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                placeholder="Enter plant name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 outline-none"
              />
            </div>

            <button
              onClick={fetchPlantDetails}
              className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={(!plantName && !previewImage) || loading}
            >
              {loading ? (
                <Loader2 className="w-6 h-6 mx-auto animate-spin" />
              ) : (
                "Get Info"
              )}
            </button>
          </div>
          <div className="flex flex-row items-center gap-96 mt-4">
            <div
              className="b-4 border-red-600 p-4 bg-white bg-opacity-90 rounded flex flex-col items-center cursor-pointer"
              onClick={() => navigate("/farmer/methods")}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/8898/8898495.png"
                alt="Methods"
                className="mb-2"
              />
              <span className="font-medium text-lg">Methods</span>
            </div>

            <div
              className="b-4 border-red-600 p-4 bg-white bg-opacity-90 rounded flex flex-col items-center cursor-pointer"
              onClick={() => navigate("/farmer/medicine")}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/4006/4006511.png"
                alt="Medicine"
                className="mb-2"
              />
              <span className="font-medium text-lg">Medicine</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto">
        {plantDetails && (
          <div className="mt-10 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-emerald-700 mb-6">
              Plant Details
            </h2>
            <p className="text-gray-700 whitespace-pre-line">
              {plantDetails.split("*").map((line, index) => (
                <React.Fragment key={index}>
                  {line.trim()}
                  <ul></ul>
                </React.Fragment>
              ))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Plant;
