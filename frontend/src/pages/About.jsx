import React from "react";
import { Leaf } from "lucide-react";

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-screen-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:scale-[1.02]">
          <div className="flex items-center justify-center mb-8">
            <Leaf className="w-8 h-8 text-emerald-500 animate-bounce" />
            <h1 className="text-3xl font-bold text-gray-800 ml-3">About Us</h1>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">
            Welcome to AgriConnect! Our mission is to empower farmers with
            cutting-edge tools and insights to optimize their agricultural
            practices. From crop management to weather integration, we provide
            a comprehensive platform to enhance farming efficiency and
            sustainability.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed mt-4">
            Our team is dedicated to bridging the gap between technology and
            agriculture, ensuring that every farmer has access to the resources
            they need to succeed. Join us on this journey to revolutionize
            farming and create a brighter future for agriculture.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;