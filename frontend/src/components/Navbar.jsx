import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';

const Navbar = () => {
  const { language } = useContext(LanguageContext);

  // return (
  //   <nav className="bg-green-700 p-4 top-0 left-0 w-full z-10">
  //     <ul className="flex justify-around">
  //       <li className="text-white font-bold text-lg hover:text-green-900 border border-white rounded-2xl p-2">
  //         <Link to="/">{language === 'en' ? 'Home' : language === 'kn' ? 'ಮನೆ' : 'होम'}</Link>
  //       </li>
  //       <li className="text-white font-bold text-lg hover:text-green-900 border border-white rounded-2xl p-2">
  //         <Link to="#about">{language === 'en' ? 'About' : language === 'kn' ? 'ಬಗ್ಗೆ' : 'के बारे में'}</Link>
  //       </li>
  //       <li className="text-white font-bold text-lg hover:text-green-900 border border-white rounded-2xl p-2">
  //         <Link to="#contact">{language === 'en' ? 'Contact Us' : language === 'kn' ? 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ' : 'संपर्क करें'}</Link>
  //       </li>
  //       <li className="text-white font-bold text-lg hover:text-green-900 border border-white rounded-2xl p-2">
  //         <Link to="/farmer-login">{language === 'en' ? 'Farmer Login' : language === 'kn' ? 'ಕೃಷಿಕ ಲಾಗಿನ್' : 'किसान लॉगिन'}</Link>
  //       </li>
  //       <li className="text-white font-bold text-lg hover:text-green-900 border border-white rounded-2xl p-2">
  //         <Link to="/admin-login">{language === 'en' ? 'Admin Login' : language === 'kn' ? 'ನಿರ್ವಾಹಕ ಲಾಗಿನ್' : 'प्रशासक लॉगिन'}</Link>
  //       </li>
  //     </ul>
  //   </nav>
  // );
};

export default Navbar;