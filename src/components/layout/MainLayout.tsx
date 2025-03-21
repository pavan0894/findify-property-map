
import React from 'react';
import Navbar from '@/components/Navbar';
import { useIsMobile } from '@/hooks/use-mobile';
import Chatbot from '@/components/Chatbot';
import { Property, POI } from '@/utils/data';

interface MainLayoutProps {
  children: React.ReactNode;
  toggleSidebar: () => void;
  sidebarOpen: boolean;
  properties: Property[];
  pointsOfInterest: POI[];
  onSelectProperty: (property: Property) => void;
  onSelectPOI: (poi: POI) => void;
  onShowPOIs: (pois: POI[]) => void;
}

const MainLayout = ({
  children,
  toggleSidebar,
  sidebarOpen,
  properties,
  pointsOfInterest,
  onSelectProperty,
  onSelectPOI,
  onShowPOIs
}: MainLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      
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
