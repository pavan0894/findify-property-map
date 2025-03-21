
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MapTokenInputProps {
  onTokenChange: (token: string) => void;
}

const MapTokenInput = ({ onTokenChange }: MapTokenInputProps) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onTokenChange(token.trim());
      toast.success('Mapbox token updated');
      localStorage.setItem('mapbox_token', token.trim());
    }
  };

  return (
    <div className="bg-muted/50 p-3 rounded-md mb-3">
      <p className="text-xs text-muted-foreground mb-2">
        For better map performance, add your own Mapbox token:
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter your Mapbox token"
          className="text-xs h-8"
        />
        <Button type="submit" size="sm" className="h-8">Apply</Button>
      </form>
      <p className="text-xs text-muted-foreground mt-1.5">
        Visit <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="underline">mapbox.com</a> to create an account and get a public token.
      </p>
    </div>
  );
};

export default MapTokenInput;
