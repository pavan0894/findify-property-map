
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send } from 'lucide-react';
import { Property, POI } from '@/utils/data';
import { toast } from '@/hooks/use-toast';

const STORAGE_KEY = 'property-assistant-chat';

// Import our utility functions
import { 
  findBestPropertyMatch, 
  findMatchingPOIs, 
  normalizeShippingService, 
  extractPOITypes 
} from '@/utils/matchingUtils';

interface ChatbotProps {
  properties: Property[];
  pois: POI[];
  onSelectProperty: (property: Property) => void;
  onSelectPOI: (poi: POI) => void;
  onShowPOIs: (pois: POI[]) => void;
  onShowPropertiesNearFedEx: () => void;
  embedded?: boolean;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const Chatbot: React.FC<ChatbotProps> = ({ 
  properties, 
  pois, 
  onSelectProperty, 
  onSelectPOI, 
  onShowPOIs,
  onShowPropertiesNearFedEx,
  embedded = false
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Load chat history from local storage on component mount
  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem(STORAGE_KEY);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        // Add a welcome message if there's no chat history
        const welcomeMessage: ChatMessage = {
          id: 'welcome',
          text: "Welcome to Property Assistant! How can I help you today? You can ask me about properties, nearby points of interest, or shipping locations.",
          sender: 'bot',
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error("Failed to load chat history from local storage", error);
      const errorMessage: ChatMessage = {
        id: 'error',
        text: "Welcome to Property Assistant! How can I help you today?",
        sender: 'bot',
      };
      setMessages([errorMessage]);
    }
  }, []);
  
  // Save chat history to local storage whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save chat history to local storage", error);
    }
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const sendMessage = useCallback(() => {
    if (!input.trim() || isLoading) return;
    
    setIsLoading(true);
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    
    // Process the user's message and generate a response
    setTimeout(() => {
      processUserMessage(input);
      setIsLoading(false);
    }, 300); // Small delay to simulate processing
  }, [input, isLoading]);
  
  const processUserMessage = useCallback((message: string) => {
    // Normalize the message to improve matching accuracy
    const normalizedMessage = message.toLowerCase().trim();
    
    // 1. Property Search by Name
    const propertyMatch = findBestPropertyMatch(normalizedMessage, properties);
    if (propertyMatch) {
      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `I found a property named ${propertyMatch.name}. Now focusing on this property.`,
        sender: 'bot',
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
      onSelectProperty(propertyMatch);
      return;
    }
    
    // 2. POI Search by Type
    const extractedTypes = extractPOITypes(normalizedMessage);
    if (extractedTypes.length > 0) {
      const matchingPOIs = findMatchingPOIs(extractedTypes[0], pois);
      if (matchingPOIs.length > 0) {
        const botMessage: ChatMessage = {
          id: Date.now().toString(),
          text: `I found ${matchingPOIs.length} locations matching "${extractedTypes[0]}". Showing them on the map.`,
          sender: 'bot',
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
        onShowPOIs(matchingPOIs);
        toast({
          title: `Found ${matchingPOIs.length} locations`,
          description: `Showing ${extractedTypes[0]} locations on the map`
        });
        return;
      } else {
        const botMessage: ChatMessage = {
          id: Date.now().toString(),
          text: `I couldn't find any specific locations matching "${extractedTypes[0]}".`,
          sender: 'bot',
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
        return;
      }
    }
    
    // 3. Find properties near a specific shipping service (e.g., FedEx)
    if (normalizedMessage.includes('near') && (normalizedMessage.includes('fedex') || normalizedMessage.includes('shipping'))) {
      const normalizedShippingQuery = normalizeShippingService(normalizedMessage);
      if (normalizedShippingQuery === 'fedex') {
        const botMessage: ChatMessage = {
          id: Date.now().toString(),
          text: "Finding properties near FedEx locations...",
          sender: 'bot',
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
        onShowPropertiesNearFedEx();
        toast({
          title: "Finding Properties Near FedEx",
          description: "Showing properties with nearby FedEx locations"
        });
        return;
      }
    }
    
    // 4. Default Response
    const botMessage: ChatMessage = {
      id: Date.now().toString(),
      text: "I'm not sure how to help with that. You can ask about specific properties by name, find points of interest like restaurants or FedEx locations, or search for properties near shipping services.",
      sender: 'bot',
    };
    setMessages(prevMessages => [...prevMessages, botMessage]);
  }, [properties, pois, onSelectProperty, onSelectPOI, onShowPOIs, onShowPropertiesNearFedEx]);
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      sendMessage();
    }
  };
  
  return (
    <Card className={`h-full flex flex-col ${embedded ? 'shadow-none border-none' : ''}`}>
      {!embedded && (
        <CardHeader>
          <h3 className="text-lg font-semibold">Property Assistant</h3>
          <p className="text-sm text-muted-foreground">Ask me anything about properties and locations</p>
        </CardHeader>
      )}
      
      <CardContent className="relative flex-1 p-2 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="flex flex-col gap-3 p-2">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="Bot Avatar" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div className={`p-3 rounded-lg max-w-[80%] ${
                  msg.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Bot Avatar" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="p-3 rounded-lg bg-muted">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-2">
        <div className="flex items-center space-x-2 w-full">
          <Input 
            type="text" 
            placeholder="Ask about properties or locations..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage} 
            disabled={isLoading || !input.trim()}
            size="icon"
          >
            <Send className="h-4 w-4"/>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Chatbot;
