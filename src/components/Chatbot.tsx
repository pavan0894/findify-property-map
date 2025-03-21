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
import { calculateDistance, kmToMiles, findPOIsNearProperty } from '@/utils/mapUtils';

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

const STORAGE_KEY = 'property-assistant-chat';

const Chatbot = ({ properties, pois, onSelectProperty, onSelectPOI }: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedChat = localStorage.getItem(STORAGE_KEY);
    if (savedChat) {
      try {
        const parsedChat = JSON.parse(savedChat, (key, value) => {
          if (key === 'timestamp') return new Date(value);
          return value;
        });
        return parsedChat;
      } catch (e) {
        console.error('Error loading chat history:', e);
      }
    }
    return [{
      id: '1',
      content: "Hello! I'm your property assistant. Ask me about warehouses or points of interest nearby.",
      sender: 'bot',
      timestamp: new Date()
    }];
  });
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      console.log('Saved messages to localStorage:', messages.length);
    }
  }, [messages]);

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
    setMessages(prevMessages => [...prevMessages, newMessage]);
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

  const handleCloseChat = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([{
      id: '1',
      content: "Hello! I'm your property assistant. Ask me about warehouses or points of interest nearby.",
      sender: 'bot',
      timestamp: new Date()
    }]);
    setActiveProperty(null);
    setIsOpen(false);
  };

  const processUserQuery = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (/^(hi|hello|hey|greetings)/.test(lowerQuery)) {
      return "Hello! I can help you find information about warehouses and points of interest. Try asking about properties near specific places, or properties with certain features.";
    }
    
    const propertyContextRegex = /(?:use|set|consider|select|about|looking at|for)\s+(?:property|warehouse|building)(?:\s+called|:|\s+named)?\s+['"]?([^'".,!?]+)['"]?/i;
    const propertyMatch = lowerQuery.match(propertyContextRegex);
    
    if (propertyMatch) {
      const propertyName = propertyMatch[1].trim();
      const matchedProperty = properties.find(p => 
        p.name.toLowerCase().includes(propertyName.toLowerCase())
      );
      
      if (matchedProperty) {
        setActiveProperty(matchedProperty);
        onSelectProperty(matchedProperty);
        return `I'll now use ${matchedProperty.name} as our reference property for your questions. What would you like to know about it or places nearby?`;
      } else {
        return `I couldn't find a property named "${propertyName}". Please try another property name.`;
      }
    }
    
    const propertyPoiRegex = /(?:find|show|are there|any|where is|location of|nearest)\s+(\w+(?:\s+\w+)*)\s+(?:near|around|within|in)\s+(\d+(?:\.\d+)?)\s*(?:miles?|mi|km|kilometers?)\s+(?:of|from)?\s+(?:this property|current property|it|selected property)/i;
    const poiNearPropertyRegex = /(?:find|show|are there|any|where is|location of|nearest)\s+(\w+(?:\s+\w+)*)\s+(?:near|around|close to|by)\s+(?:this property|current property|it|selected property)/i;
    
    const propertyPoiMatch = lowerQuery.match(propertyPoiRegex);
    const simplePoiMatch = lowerQuery.match(poiNearPropertyRegex);
    
    if (activeProperty && (propertyPoiMatch || simplePoiMatch)) {
      let poiType = '';
      let distance = 5; // Default 5 miles if not specified
      
      if (propertyPoiMatch) {
        poiType = propertyPoiMatch[1].trim().toLowerCase();
        distance = parseFloat(propertyPoiMatch[2]);
        
        if (lowerQuery.includes('mile') || lowerQuery.includes('mi')) {
          distance = distance * 1.60934; // Convert miles to km
        }
      } else if (simplePoiMatch) {
        poiType = simplePoiMatch[1].trim().toLowerCase();
        distance = 5 * 1.60934; // Default 5 miles in km
      }
      
      console.log(`Searching for POI type: "${poiType}" within ${distance}km of ${activeProperty.name}`);
      
      const matchingPois = pois.filter(poi => 
        poi.type.toLowerCase().includes(poiType.toLowerCase())
      );
      
      console.log(`Found ${matchingPois.length} POIs matching "${poiType}"`);
      
      if (matchingPois.length === 0) {
        return `I couldn't find any points of interest matching "${poiType}". Try something like "restaurant", "coffee shop", or "office".`;
      }
      
      const nearbyPois = findPOIsNearProperty(matchingPois, activeProperty, distance);
      console.log(`Found ${nearbyPois.length} ${poiType} locations within ${distance.toFixed(1)}km of ${activeProperty.name}`);
      
      if (nearbyPois.length === 0) {
        return `I couldn't find any ${poiType} locations within ${distance.toFixed(1)} ${lowerQuery.includes('kilometer') || lowerQuery.includes('km') ? 'kilometers' : 'miles'} of ${activeProperty.name}.`;
      }
      
      nearbyPois.sort((a, b) => {
        const distA = calculateDistance(activeProperty.latitude, activeProperty.longitude, a.latitude, a.longitude);
        const distB = calculateDistance(activeProperty.latitude, activeProperty.longitude, b.latitude, b.longitude);
        return distA - distB;
      });
      
      const poiLinks = nearbyPois.slice(0, 5).map(poi => {
        const dist = calculateDistance(activeProperty.latitude, activeProperty.longitude, poi.latitude, poi.longitude);
        const distStr = lowerQuery.includes('kilometer') || lowerQuery.includes('km') 
          ? `${dist.toFixed(1)} km` 
          : `${kmToMiles(dist).toFixed(1)} miles`;
        
        return `<a href="#" class="text-primary hover:underline" data-poi-id="${poi.id}">${poi.name}</a> (${distStr})`;
      }).join(', ');
      
      return `I found ${nearbyPois.length} ${poiType} locations near ${activeProperty.name}. Here are the closest ones: ${poiLinks}. Click on any location to see it on the map.`;
    }
    
    if (/how many (properties|warehouses) (are there|do you have|are available)/.test(lowerQuery) || 
        /^(show|list|tell me about) (all|the) (properties|warehouses)/.test(lowerQuery)) {
      const propertyLinks = properties.slice(0, 5).map(property => 
        `<a href="#" class="text-primary hover:underline" data-property-id="${property.id}">${property.name}</a>`
      ).join(', ');
      
      return `I have information on ${properties.length} properties. Here are a few examples: ${propertyLinks}. Click on any property to see more details.`;
    }
    
    if (/what (types of|kind of|) (poi|point of interest|places|locations)/.test(lowerQuery)) {
      const uniqueTypes = Array.from(new Set(pois.map(poi => poi.type)));
      return `I can help you find properties near various points of interest, including: ${uniqueTypes.join(', ')}. Try asking something like "Show properties within 2 miles of a coffee shop".`;
    }
    
    const distanceRegex = /within\s+(\d+(?:\.\d+)?)\s*(miles?|mi|kilometers?|km)\s+(?:of|from)\s+(?:a|an)?\s*(.+)/i;
    const distanceMatch = lowerQuery.match(distanceRegex);
    
    if (distanceMatch) {
      const distance = parseFloat(distanceMatch[1]);
      const unit = distanceMatch[2].toLowerCase();
      const poiType = distanceMatch[3].trim();
      
      const distanceKm = unit.startsWith('m') ? distance * 1.60934 : distance;
      
      const matchedPOIs = pois.filter(poi => 
        poi.type.toLowerCase().includes(poiType)
      );
      
      if (matchedPOIs.length === 0) {
        return `I couldn't find any points of interest matching "${poiType}". Try something like "coffee shop", "restaurant", or "office".`;
      }
      
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
    
    const poiTypeRegex = /where (are|is) the (nearest|closest) (.+)/i;
    const poiTypeMatch = lowerQuery.match(poiTypeRegex);
    
    if (poiTypeMatch) {
      const poiType = poiTypeMatch[3].trim();
      const matchedPOIs = pois.filter(poi => 
        poi.type.toLowerCase().includes(poiType)
      );
      
      if (matchedPOIs.length === 0) {
        return `I couldn't find any points of interest matching "${poiType}". Try something like "coffee shop", "restaurant", or "office".`;
      }
      
      const poiLinks = matchedPOIs.slice(0, 5).map(poi => 
        `<a href="#" class="text-primary hover:underline" data-poi-id="${poi.id}">${poi.name}</a>`
      ).join(', ');
      
      return `Here are some ${poiType} locations: ${poiLinks}. Click on any location to see it on the map.`;
    }
    
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
    
    if (lowerQuery.includes('average price') || lowerQuery.includes('median price')) {
      const avgPrice = properties.reduce((sum, prop) => sum + prop.price, 0) / properties.length;
      return `The average price of all properties is ${formatPrice(avgPrice)}.`;
    }
    
    if (lowerQuery.includes('average size') || lowerQuery.includes('median size')) {
      const avgSize = properties.reduce((sum, prop) => sum + prop.size, 0) / properties.length;
      return `The average size of all properties is ${formatSize(avgSize)}.`;
    }
    
    if (lowerQuery.includes('newest') || lowerQuery.includes('most recent')) {
      const newest = [...properties].sort((a, b) => b.year - a.year)[0];
      return `The newest property is <a href="#" class="text-primary hover:underline" data-property-id="${newest.id}">${newest.name}</a>, built in ${newest.year}. Click to view details.`;
    }
    
    if (lowerQuery.includes('oldest')) {
      const oldest = [...properties].sort((a, b) => a.year - b.year)[0];
      return `The oldest property is <a href="#" class="text-primary hover:underline" data-property-id="${oldest.id}">${oldest.name}</a>, built in ${oldest.year}. Click to view details.`;
    }
    
    if (activeProperty) {
      return `You're currently looking at ${activeProperty.name}. You can ask things like:\n\n• 'Find coffee shops within 2 miles of this property'\n• 'Where is the nearest restaurant to this property?'\n• 'Show me FedEx locations around this property'\n\nOr you can select a different property with 'Use property [name]'.`;
    }
    
    return "I can help you find properties based on specific criteria. Try asking something like:\n\n• 'Use property Gateway Logistics Center'\n• 'Show properties within 2 miles of a coffee shop'\n• 'What's the largest warehouse?'\n• 'Find me properties with loading docks'\n• 'What's the cheapest property?'\n• 'Where is the nearest restaurant?'\n• 'What types of points of interest are available?'";
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
    const target = e.target as HTMLElement;
    if (target.tagName === 'A') {
      e.preventDefault();
      
      if (target.hasAttribute('data-property-id')) {
        const propertyId = target.getAttribute('data-property-id');
        const property = properties.find(p => p.id === propertyId);
        
        if (property) {
          setActiveProperty(property);
          onSelectProperty(property);
        }
      } else if (target.hasAttribute('data-poi-id')) {
        const poiId = target.getAttribute('data-poi-id');
        const poi = pois.find(p => p.id === poiId);
        
        if (poi) {
          onSelectPOI(poi);
        }
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
              <h3 className="font-medium">
                Property Assistant
                {activeProperty && (
                  <span className="ml-1 text-xs text-primary font-normal">
                    ({activeProperty.name})
                  </span>
                )}
              </h3>
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
                onClick={handleCloseChat}
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
                placeholder={activeProperty 
                  ? `Ask about ${activeProperty.name}...` 
                  : "Ask about properties..."
                }
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
