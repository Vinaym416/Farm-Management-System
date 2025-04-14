import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Plane as Plant, Tractor, Users, CloudRain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext'; // Import LanguageContext

function Home() {
  const { language, setLanguage } = useContext(LanguageContext); // Use global language context

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Navbar */}
      <nav className="relative bg-green-900 text-white p-4 top-0 left-0 w-full z-10">
        <ul className="flex justify-around items-center">
          <li className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-800 transition-colors">
            <Link to="/">{language === 'en' ? 'Home' : language === 'kn' ? 'ಮನೆ' : 'होम'}</Link>
          </li>
          <li className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-800 transition-colors">
            <Link to="/about">{language === 'en' ? 'About' : language === 'kn' ? 'ಬಗ್ಗೆ' : 'के बारे में'}</Link>
          </li>
          <li className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-800 transition-colors">
            <Link to="/contact">{language === 'en' ? 'Contact' : language === 'kn' ? 'ಸಂಪರ್ಕ' : 'संपर्क करें'}</Link>
          </li>
          <li>
            <select
              className="border-2 bg-green-900 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-800 transition-colors"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="hi">हिन्दी</option>
            </select>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-green-800 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
            alt="Farm landscape"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="text-4xl md:text-6xl font-bold text-center mb-8"
          >
            {language === 'en' && 'AgriConnect: Smart Farming & Analysis Platform'}
            {language === 'kn' && 'ಅಗ್ರಿಕನೆಕ್ಟ್: ಸ್ಮಾರ್ಟ್ ಫಾರ್ಮಿಂಗ್ ಮತ್ತು ವಿಶ್ಲೇಷಣಾ ವೇದಿಕೆ'}
            {language === 'hi' && 'एग्रीकनेक्ट: स्मार्ट खेती और विश्लेषण प्लेटफॉर्म'}
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-center max-w-3xl mx-auto mb-12"
          >
            {language === 'en' && 'Enhance your farming efficiency with our intelligent agricultural management platform'}
            {language === 'kn' && 'ನಮ್ಮ ಬುದ್ಧಿವಂತ ಕೃಷಿ ನಿರ್ವಹಣಾ ವೇದಿಕೆಯೊಂದಿಗೆ ನಿಮ್ಮ ಕೃಷಿ ದಕ್ಷತೆಯನ್ನು ಹೆಚ್ಚಿಸಿ'}
            {language === 'hi' && 'हमारे बुद्धिमान कृषि प्रबंधन प्लेटफ़ॉर्म के साथ अपनी खेती की दक्षता बढ़ाएँ'}
          </motion.p>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center space-x-4"
          >
            <Link
              to="/get-started"
              className="bg-white text-green-800 px-8 py-3 rounded-lg font-semibold hover:bg-green-100 transition-colors"
            >
              {language === 'en' && 'Get Started'}
              {language === 'kn' && 'ಪ್ರಾರಂಭಿಸಿ'}
              {language === 'hi' && 'शुरू करें'}
            </Link>
            <Link
              to="/farmer-login"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-800 transition-colors"
            >
              {language === 'en' && 'Farmer Login'}
              {language === 'kn' && 'ಕೃಷಿಕ ಲಾಗಿನ್'}
              {language === 'hi' && 'किसान लॉगिन'}
            </Link>
            <Link
              to="/admin-login"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-800 transition-colors"
            >
              {language === 'en' && 'Admin Login'}
              {language === 'kn' && 'ನಿರ್ವಾಹಕ ಲಾಗಿನ್'}
              {language === 'hi' && 'प्रशासक लॉगिन'}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <FeatureCard
            icon={<Plant className="h-8 w-8" />}
            title="Crop Management"
            description="Track and optimize your crop cycles from planting to harvest"
          />
          <FeatureCard
            icon={<Tractor className="h-8 w-8" />}
            title="Equipment Tracking"
            description="Monitor equipment maintenance and usage efficiently"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="Worker Management"
            description="Manage your workforce and assign tasks effectively"
          />
          <FeatureCard
            icon={<CloudRain className="h-8 w-8" />}
            title="Weather Integration"
            description="Stay updated with real-time weather forecasts"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <div className="text-green-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

export default Home;