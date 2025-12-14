import React from "react";
import { Wrench } from "lucide-react"; 

const MaintenanceBanner: React.FC = () => {
  return (
    <div className="bg-yellow-500 text-white py-3 overflow-hidden whitespace-nowrap shadow-md">
      <div className="inline-flex items-center animate-marquee font-semibold text-lg">
        <Wrench className="w-6 h-6 mr-2" />
        Le salon de coiffure est actuellement en travaux — Service en maintenance
        <Wrench className="w-6 h-6 ml-2" />
      </div>
    </div>
  );
};

export default MaintenanceBanner;
