
import React from 'react';

interface MapTokenInputProps {
  onTokenChange: (token: string) => void;
}

const MapTokenInput = ({ onTokenChange }: MapTokenInputProps) => {
  return (
    <div className="bg-muted/50 p-3 rounded-md mb-3">
      <p className="text-xs text-muted-foreground">
        For better map performance, visit <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="underline">mapbox.com</a> to create an account and get a public token.
      </p>
    </div>
  );
};

export default MapTokenInput;
