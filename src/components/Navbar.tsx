
import React from 'react';
import { Warehouse } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const isMobile = useIsMobile();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 glass-panel-darker backdrop-blur-md animate-fade-in">
      <header className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Warehouse className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">
            Survey Agent
          </h1>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
