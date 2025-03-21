
import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  SendHorizonal, 
  Bot, 
  User, 
  X, 
  Maximize2, 
  Minimize2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Property, POI } from '@/utils/data';
import { calculateDistance, kmToMiles } from '@/utils/mapUtils';

interface ChatbotProps {
  properties: Property[];
  pois: POI[];
  onSelectProperty: (property: Property) => void;
  onSelectPOI: (poi: POI) => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot = ({ properties, pois, onSelectProperty, onSelectPOI }: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your property assistant. Ask me about warehouses or points of interest nearby.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const addMessage = (content: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date()
    };
    setMessages([...messages, newMessage]);
  };

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    addMessage(inputValue, 'user');
    setInputValue('');
    setIsThinking(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const response = processUserQuery(inputValue);
      addMessage(response, 'bot');
      setIsThinking(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const processUserQuery = (query: string): string => {
    // Convert query to lowercase for easier matching
    const lowerQuery = query.toLowerCase();
    
    // Check if asking about properties within a distance of a POI type
    const distanceRegex = /within\s+(\d+(?:\.\d+)?)\s*(miles?|mi|kilometers?|km)\s+(?:of|from)\s+(?:a|an)?\s*(.+)/i;
    const distanceMatch = lowerQuery.match(distanceRegex);
    
    if (distanceMatch) {
      const distance = parseFloat(distanceMatch[1]);
      const unit = distanceMatch[2].toLowerCase();
      const poiType = distanceMatch[3].trim();
      
      // Convert to km if in miles
      const distanceKm = unit.startsWith('m') ? distance * 1.60934 : distance;
      
      // Find POIs of the requested type
      const matchedPOIs = pois.filter(poi => 
        poi.type.toLowerCase().includes(poiType)
      );
      
      if (matchedPOIs.length === 0) {
        return `I couldn't find any points of interest matching "${poiType}". Try something like "coffee shop", "restaurant", or "office".`;
      }
      
      // Find properties within the specified distance of any matching POI
      const matchedProperties: { property: Property, poi: POI, distance: number }[] = [];
      
      properties.forEach(property => {
        matchedPOIs.forEach(poi => {
          const dist = calculateDistance(
            property.latitude,
            property.longitude,
            poi.latitude,
            poi.longitude
          );
          
          if (dist <= distanceKm) {
            matchedProperties.push({
              property,
              poi,
              distance: dist
            });
          }
        });
      });
      
      // Sort by distance
      matchedProperties.sort((a, b) => a.distance - b.distance);
      
      if (matchedProperties.length === 0) {
        return `I couldn't find any properties within ${distance} ${unit.startsWith('m') ? 'miles' : 'kilometers'} of a ${poiType}.`;
      }
      
      const propertyLinks = matchedProperties.slice(0, 5).map(({ property, poi, distance }) => {
        const distanceStr = unit.startsWith('m') 
          ? `${kmToMiles(distance).toFixed(1)} miles`
          : `${distance.toFixed(1)} km`;
        
        return `<a href="#" class="text-primary hover:underline" data-property-id="${property.id}">${property.name}</a> (${distanceStr} from ${poi.name})`;
      }).join(', ');
      
      return `I found ${matchedProperties.length} properties within ${distance} ${unit.startsWith('m') ? 'miles' : 'kilometers'} of a ${poiType}. Here are the closest ones: ${propertyLinks}. Click on a property name to view details.`;
    }
    
    // Check if asking for the largest/smallest property
    if (lowerQuery.includes('largest') || lowerQuery.includes('biggest')) {
      const sortedBySize = [...properties].sort((a, b) => b.size - a.size);
      const largest = sortedBySize[0];
      
      return `The largest property is <a href="#" class="text-primary hover:underline" data-property-id="${largest.id}">${largest.name}</a> with ${formatSize(largest.size)}. Click to view details.`;
    }
    
    if (lowerQuery.includes('smallest')) {
      const sortedBySize = [...properties].sort((a, b) => a.size - b.size);
      const smallest = sortedBySize[0];
      
      return `The smallest property is <a href="#" class="text-primary hover:underline" data-property-id="${smallest.id}">${smallest.name}</a> with ${formatSize(smallest.size)}. Click to view details.`;
    }
    
    // Check if asking for the most/least expensive property
    if (lowerQuery.includes('most expensive') || lowerQuery.includes('highest price')) {
      const sortedByPrice = [...properties].sort((a, b) => b.price - a.price);
      const mostExpensive = sortedByPrice[0];
      
      return `The most expensive property is <a href="#" class="text-primary hover:underline" data-property-id="${mostExpensive.id}">${mostExpensive.name}</a> at ${formatPrice(mostExpensive.price)}. Click to view details.`;
    }
    
    if (lowerQuery.includes('least expensive') || lowerQuery.includes('cheapest') || lowerQuery.includes('lowest price')) {
      const sortedByPrice = [...properties].sort((a, b) => a.price - b.price);
      const leastExpensive = sortedByPrice[0];
      
      return `The least expensive property is <a href="#" class="text-primary hover:underline" data-property-id="${leastExpensive.id}">${leastExpensive.name}</a> at ${formatPrice(leastExpensive.price)}. Click to view details.`;
    }
    
    // Check if asking for properties with specific features
    const featureMatch = lowerQuery.match(/properties?\s+with\s+(.+)/i);
    if (featureMatch) {
      const requestedFeature = featureMatch[1].trim();
      const matchedProperties = properties.filter(property => 
        property.features.some(feature => 
          feature.toLowerCase().includes(requestedFeature)
        )
      );
      
      if (matchedProperties.length === 0) {
        return `I couldn't find any properties with features matching "${requestedFeature}". Try something like "loading docks", "office space", or "security".`;
      }
      
      const propertyLinks = matchedProperties.slice(0, 5).map(property => 
        `<a href="#" class="text-primary hover:underline" data-property-id="${property.id}">${property.name}</a>`
      ).join(', ');
      
      return `I found ${matchedProperties.length} properties with features matching "${requestedFeature}". Here are some: ${propertyLinks}. Click on a property name to view details.`;
    }
    
    // Generic response for other queries
    return "I can help you find properties based on specific criteria. Try asking something like:\n\n• 'Show properties within 2 miles of a coffee shop'\n• 'What's the largest warehouse?'\n• 'Find me properties with loading docks'\n• 'What's the cheapest property?'";
  };

  const formatSize = (size: number): string => {
    return `${size.toLocaleString()} sq ft`;
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleMessageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click was on a property link
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' && target.hasAttribute('data-property-id')) {
      e.preventDefault();
      const propertyId = target.getAttribute('data-property-id');
      const property = properties.find(p => p.id === propertyId);
      
      if (property) {
        onSelectProperty(property);
      }
    }
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={handleToggleChat}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <div 
          className={`fixed ${isExpanded ? 'inset-4 md:inset-10' : 'bottom-6 right-6 w-80 md:w-96 h-[32rem]'} 
            glass-panel rounded-2xl shadow-xl border z-50 flex flex-col overflow-hidden transition-all duration-300 ease-in-out animate-fade-in`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-medium">Property Assistant</h3>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-secondary"
                onClick={handleToggleExpand}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-secondary"
                onClick={handleToggleChat}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div 
            className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar"
            onClick={handleMessageClick}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-none'
                      : 'bg-secondary rounded-tl-none'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === 'bot' && (
                      <Bot className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <div 
                        className="text-sm"
                        dangerouslySetInnerHTML={{ __html: message.content }}
                      />
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {message.sender === 'user' && (
                      <User className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 bg-secondary rounded-2xl rounded-tl-none">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    <div className="flex gap-1">
                      <span className="h-2 w-2 bg-foreground/30 rounded-full animate-pulse delay-0"></span>
                      <span className="h-2 w-2 bg-foreground/30 rounded-full animate-pulse delay-150"></span>
                      <span className="h-2 w-2 bg-foreground/30 rounded-full animate-pulse delay-300"></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Ask about properties..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-secondary/50 border-input/50"
                disabled={isThinking}
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                className="h-10 w-10 rounded-full"
                disabled={!inputValue.trim() || isThinking}
              >
                <SendHorizonal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
