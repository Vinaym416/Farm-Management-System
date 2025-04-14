import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const First = () => {
  const { language } = useContext(LanguageContext);

  return (
    <div className="relative h-screen">
      <img
        src="https://static.vecteezy.com/system/resources/previews/052/333/875/non_2x/moss-covered-stones-in-a-lush-green-forest-photo.jpg"
        alt="Welcome Sign in Lush Green Forest"
        className="w-full h-full object-cover"
      />
      
    </div>
  );
};

export default First;