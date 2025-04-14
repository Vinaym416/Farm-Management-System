import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";

const FarmerDashboard = () => {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const firstName = "John"; // Replace with the actual first name from your context or state

  const [weather, setWeather] = useState({
    temp: "Loading...",
    humidity: "Loading...",
    pressure: "Loading...",
    wind: "Loading...",
    windDirection: "Loading...",
    rainPrediction: "Loading...",
    rainfallAmount: "Loading...",
    soilMoisture: "Loading...",
  });

  useEffect(() => {
    const handlePopState = () => {
      navigate("/farmer-login");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  useEffect(() => {
    const fetchWeatherData = async (latitude, longitude) => {
      const apiKey = "bd5e378503939ddaee76f12ad7a97608"; // Replace with your OpenWeatherMap API key
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
      );
      const data = await response.json();
      setWeather({
        temp: `${data.main.temp}°C`,
        humidity: `${data.main.humidity}%`,
        pressure: `${data.main.pressure} hPa`,
        wind: `${data.wind.speed} km/h`,
        windDirection: data.wind.deg,
        rainPrediction: data.weather[0].description,
        rainfallAmount: data.rain ? `${data.rain["1h"]} mm` : "0 mm",
        // soilMoisture: 'N/A', // Soil moisture data is not available from OpenWeatherMap
      });
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, []);

  const handleSignOut = () => {
    navigate("/farmer-login");
  };

  return (
    <div className="h-screen flex flex-col">
      <header
        className="flex justify-between items-center p-4 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://png.pngtree.com/thumb_back/fh260/background/20220313/pngtree-close-up-of-golden-paddy-field-taken-on-the-horizontal-plate-image_1001142.jpg')",
        }}
      >
        <h1 className="text-black text-2xl font-bold">Hi {firstName}</h1>
        <h1 className="text-center text-black text-3xl mb-4 font-semibold">
          {language === "en" && "Welcome to the Farmer Dashboard"}
          {language === "kn" && "ಕೃಷಿಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಸ್ವಾಗತ"}
          {language === "hi" && "किसान डैशबोर्ड में आपका स्वागत है"}
        </h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white p-2 rounded font-medium"
        >
          Sign Out
        </button>
      </header>

      <div className="flex-grow bg-cover bg-center bg-opacity-100 bg-black">
        <main className="p-4 flex flex-col items-center  h-full gap-20">
          <div className="mt-8 p-4 bg-white bg-opacity-50 rounded w-full">
            <h2 className="text-center text-3xl mb-4 font-semibold">
              Real-Time Weather Forecast
            </h2>
            <div className="flex justify-around text-lg opacity-90">
              <div className="flex flex-col items-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/14210/14210283.png"
                  alt="Thermostat"
                  className="w-12 h-12 mb-2"
                />
                <span className="font-medium">Temp: {weather.temp}</span>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/8923/8923690.png"
                  alt="Water Drop"
                  className="w-12 h-12 mb-2"
                />
                <span className="font-medium">
                  Humidity: {weather.humidity}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/3563/3563395.png"
                  alt="Speed"
                  className="w-12 h-12 mb-2"
                />
                <span className="font-medium">
                  Pressure: {weather.pressure}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/4324/4324144.png"
                  alt="Air"
                  className="w-12 h-12 mb-2"
                />
                <span className="font-medium">Wind: {weather.wind}</span>
                <span className="font-medium">
                  Direction: {weather.windDirection}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/14828/14828765.png"
                  alt="Umbrella"
                  className="w-12 h-12 mb-2"
                />
                <span className="font-medium">
                  Rain Prediction: {weather.rainPrediction}
                </span>
                <span className="font-medium">
                  Amount: {weather.rainfallAmount}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-40">
            <div
              className="border-4 border-green-700 p-4 bg-white bg-opacity-90 rounded flex flex-col items-center cursor-pointer"
              onClick={() => navigate("/Plant")}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/2303/2303716.png"
                alt="Plants"
                className="mb-2"
              />
              <span className="font-medium text-lg">Plants</span>
            </div>
            {/* <div className="border-4 border-blue-700 p-4 bg-white bg-opacity-90 rounded flex flex-col items-center cursor-pointer"
                 onClick={() => navigate('/farmer/medicine')}>
              <img src="https://cdn-icons-png.flaticon.com/128/4006/4006511.png" alt="Medicine" className="mb-2" />
              <span className="font-medium text-lg">Medicine</span>
            </div> */}
            {/* <div className="border-4 border-yellow-700 p-4 bg-white bg-opacity-90 rounded flex flex-col items-center cursor-pointer"
                 onClick={() => navigate('/farmer/methods')}>
              <img src="https://cdn-icons-png.flaticon.com/128/8898/8898495.png" alt="Methods" className="mb-2" />
              <span className="font-medium text-lg">Methods</span>
            </div> */}

<div
  className="border-4 border-orange-700 p-4 bg-white bg-opacity-90 rounded flex flex-col items-center cursor-pointer"
  onClick={() =>
    navigate("/Community/communitydash", {
      state: { user: { name: "John Farmer", role: "farmer" } },
    })
  }
>
  <img
    src="https://cdn-icons-png.flaticon.com/128/3365/3365355.png"
    alt="Community"
    className="mb-2"
  />
  <span className="font-medium text-lg">Community</span>
</div>

            <div
              className="border-4 border-red-700 p-4 bg-white bg-opacity-90 rounded flex flex-col items-center cursor-pointer"
              onClick={() => navigate("/farmer/helpdesk")}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/17645/17645791.png"
                alt="Connect to Helpdesk"
                className="mb-2"
              />
              <span className="font-medium text-lg">Connect to Helpdesk</span>
            </div>

            <div
              className="fixed bottom-4 right-4 w-20 h-20 bg-purple-700 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform duration-300"
              onClick={() => navigate("/farmer/ai-assistant")} // Navigate to AI Assistant
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/14958/14958196.png"
                alt="AI Assistant"
                className="w-12 h-12"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FarmerDashboard;
