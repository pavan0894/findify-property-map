
import React from 'react';
import { Warehouse, Search, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';

interface NavbarProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Navbar = ({ toggleSidebar, sidebarOpen }: NavbarProps) => {
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
        
        <div className="flex items-center gap-3">
          {!isMobile && (
            <div className="flex items-center bg-secondary/50 rounded-full px-3 py-1.5 gap-2 border border-border/50">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Search properties...</span>
            </div>
          )}
          
          <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90">
            Get Started
          </Button>
          
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="text-foreground"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </header>
    </div>
  );
};

export default Navbar;
