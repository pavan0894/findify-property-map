
import React from 'react';
import Navbar from '@/components/Navbar';
import Chatbot from '@/components/Chatbot';
import { Property, POI } from '@/utils/data';

interface MainLayoutProps {
  children: React.ReactNode;
  properties: Property[];
  pointsOfInterest: POI[];
  onSelectProperty: (property: Property) => void;
  onSelectPOI: (poi: POI) => void;
  onShowPOIs: (pois: POI[]) => void;
}

const MainLayout = ({
  children,
  properties,
  pointsOfInterest,
  onSelectProperty,
  onSelectPOI,
  onShowPOIs
}: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 flex flex-col pt-16">
        {children}
      </main>
      
      <Chatbot
        properties={properties}
        pois={pointsOfInterest}
        onSelectProperty={onSelectProperty}
        onSelectPOI={onSelectPOI}
        onShowPOIs={onShowPOIs}
      />
    </div>
  );
};

export default MainLayout;
