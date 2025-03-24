import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send } from 'lucide-react';
import { Property, POI } from '@/utils/data';

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
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Load chat history from local storage on component mount
  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem(STORAGE_KEY);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error("Failed to load chat history from local storage", error);
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
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Process the user's message and generate a response
    processUserMessage(input);
    
    setInput('');
  }, [input, properties, pois, onSelectProperty, onSelectPOI, onShowPOIs, onShowPropertiesNearFedEx]);
  
  const processUserMessage = useCallback(async (message: string) => {
    // Normalize the message to improve matching accuracy
    const normalizedMessage = message.toLowerCase();
    
    // 1. Property Search by Name
    const propertyMatch = findBestPropertyMatch(normalizedMessage, properties);
    if (propertyMatch) {
      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `I found a property named ${propertyMatch.name}.`,
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
        return;
      }
    }
    
    // 4. Default Response
    const botMessage: ChatMessage = {
      id: Date.now().toString(),
      text: "I'm sorry, I didn't understand your request. Please try again.",
      sender: 'bot',
    };
    setMessages(prevMessages => [...prevMessages, botMessage]);
  }, [properties, pois, onSelectProperty, onSelectPOI, onShowPOIs, onShowPropertiesNearFedEx]);
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
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
      
      <CardContent className="relative flex-1 p-2">
        <ScrollArea ref={chatContainerRef} className="h-full">
          <div className="flex flex-col gap-2 p-2">
            {messages.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.sender === 'bot' && (
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="https://github.com/shadcn.png" alt="Bot Avatar" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-gray-500">Property Assistant</p>
                  </div>
                )}
                <div className={`rounded-lg p-3 text-sm max-w-[70%] ${msg.sender === 'user' ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-2">
        <div className="flex items-center space-x-2 w-full">
          <Input 
            type="text" 
            placeholder="Ask me anything..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button onClick={sendMessage}><Send className="h-4 w-4"/></Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Chatbot;
