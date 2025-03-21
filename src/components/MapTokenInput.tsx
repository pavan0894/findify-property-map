
import React from 'react';

interface MapTokenInputProps {
  onTokenChange: (token: string) => void;
}

const MapTokenInput = ({ onTokenChange }: MapTokenInputProps) => {
  return (
    <div className="bg-muted/50 p-3 rounded-md mb-3">
      <p className="text-xs text-muted-foreground">
        Using Mapbox token: <span className="font-mono text-xs opacity-75 bg-muted px-1 py-0.5 rounded">pk...gjA</span>
      </p>
    </div>
  );
};

export default MapTokenInput;
