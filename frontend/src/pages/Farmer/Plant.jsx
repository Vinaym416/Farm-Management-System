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

            {/* <div className="relative">
              {previewImage ? (
                <div className="relative group">
                  <img
                    src={previewImage}
                    alt="Plant preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                    <button
                      onClick={() => setPreviewImage(null)}
                      className="text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : showCamera ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={capturePhoto}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-4 py-2 rounded-full hover:bg-emerald-600 transition-colors duration-300"
                  >
                    Capture
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors duration-300">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {isUploading ? (
                    <Loader2 className="w-12 h-12 mx-auto text-emerald-500 animate-spin" />
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-300"
                        >
                          <Upload className="w-5 h-5 mr-2" />
                          Upload Photo
                        </button>
                        <button
                          onClick={startCamera}
                          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                        >
                          <Camera className="w-5 h-5 mr-2" />
                          Take Photo
                        </button>
                      </div>
                      <p className="text-gray-500">
                        or drag and drop your image here
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div> */}

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
              className=" b-4 border-red-600  p-4 bg-white bg-opacity-90 rounded flex flex-col items-center cursor-pointer"
              onClick={() => navigate("/farmer/methods")} // Navigate to Methods
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/8898/8898495.png"
                alt="Methods"
                className="mb-2"
              />
              <span className="font-medium text-lg">Methods</span>
            </div>

            <div
              className=" b-4 border-red-600 p-4 bg-white bg-opacity-90 rounded  flex flex-col items-center cursor-pointer"
              onClick={() => navigate("/farmer/medicine")} // Navigate to Medicine
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/4006/4006511.png"
                alt="Medicine"
                className="mb-2"
              />
              <span className="  font-medium text-lg">Medicine</span>
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
            <p className="text-gray-700 whitespace-pre-line">{plantDetails}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Plant;
