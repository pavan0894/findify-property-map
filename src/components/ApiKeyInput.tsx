
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const LOCAL_STORAGE_KEY = 'openai-api-key';

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeyChange }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [isApiKeySaved, setIsApiKeySaved] = useState<boolean>(false);

  useEffect(() => {
    // Load API key from localStorage on component mount
    const savedApiKey = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsApiKeySaved(true);
      onApiKeyChange(savedApiKey);
    }
  }, [onApiKeyChange]);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem(LOCAL_STORAGE_KEY, apiKey);
      setIsApiKeySaved(true);
      onApiKeyChange(apiKey);
      toast({
        title: "API Key Saved",
        description: "Your OpenAI API key has been saved in your browser.",
      });
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setApiKey('');
    setIsApiKeySaved(false);
    onApiKeyChange('');
    toast({
      title: "API Key Removed",
      description: "Your OpenAI API key has been removed.",
    });
  };

  return (
    <div className="p-4 border rounded-lg bg-background shadow-sm">
      <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
        <Key className="h-4 w-4" />
        OpenAI API Key
      </h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            type={showApiKey ? 'text' : 'password'}
            placeholder="Enter your OpenAI API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowApiKey(!showApiKey)}
            type="button"
          >
            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveApiKey}
            disabled={!apiKey.trim() || isApiKeySaved}
            className="w-full"
          >
            Save Key
          </Button>
          {isApiKeySaved && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearApiKey}
              className="w-full"
            >
              Clear Key
            </Button>
          )}
        </div>
        {isApiKeySaved && (
          <p className="text-xs text-muted-foreground">
            Your API key is saved in your browser's local storage.
          </p>
        )}
      </div>
    </div>
  );
};

export default ApiKeyInput;
