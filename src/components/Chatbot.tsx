import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  SendHorizonal, 
  Bot, 
  User, 
  X, 
  Maximize2, 
  Minimize2,
  Sparkles
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Property, POI, formatPrice, formatSize } from '@/utils/data';
import { 
  calculateDistance, 
  kmToMiles, 
  findPOIsNearProperty, 
  findPropertiesNearPOIType
} from '@/utils/mapUtils';
import { toast } from '@/hooks/use-toast';
import ApiKeyInput from './ApiKeyInput';
import { 
  getOpenAIResponse, 
  ChatMessage, 
  PriceComparisonType, 
  formatPropertyAssistantPrompt,
  normalizeShippingService,
  extractPOITypes,
  findBestMatch
} from '@/utils/openAIUtils';

interface ChatbotProps {
  properties: Property[];
  pois: POI[];
  onSelectProperty: (property: Property) => void;
  onSelectPOI: (poi: POI) => void;
  onShowPOIs: (pois: POI[]) => void;
  onShowPropertiesNearFedEx?: () => void;
  embedded?: boolean;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const STORAGE_KEY = 'property-assistant-chat';

const Chatbot = ({ properties, pois, onSelectProperty, onSelectPOI, onShowPOIs, onShowPropertiesNearFedEx, embedded = false }: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(embedded);
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
      content: "Hello! I'm your property assistant powered by AI. Ask me about warehouses or points of interest nearby.",
      sender: 'bot',
      timestamp: new Date()
    }];
  });
  
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  const [openAIKey, setOpenAIKey] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o-mini');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [useAI, setUseAI] = useState(false);
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

  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai-api-key');
    if (savedApiKey) {
      console.log('Found saved API key, enabling AI mode');
      setOpenAIKey(savedApiKey);
      setUseAI(true);
    }
    
    const savedModel = localStorage.getItem('openai-model');
    if (savedModel) {
      console.log('Found saved model:', savedModel);
      setSelectedModel(savedModel);
    }
  }, []);

  const filterPropertiesBySize = (targetSize: number, properties: Property[]): Property[] => {
    const tolerance = 0.25; // 25% tolerance
    const minSize = targetSize * (1 - tolerance);
    const maxSize = targetSize * (1 + tolerance);
    return properties.filter(p => p.size >= minSize && p.size <= maxSize);
  };

  const filterPropertiesByPrice = (targetPrice: number, comparisonType: PriceComparisonType, properties: Property[]): Property[] => {
    switch (comparisonType) {
      case "below":
        return properties.filter(p => p.price <= targetPrice);
      case "above":
        return properties.filter(p => p.price >= targetPrice);
      case "around":
      default:
        const tolerance = 0.25; // 25% tolerance
        const minPrice = targetPrice * (1 - tolerance);
        const maxPrice = targetPrice * (1 + tolerance);
        return properties.filter(p => p.price >= minPrice && p.price <= maxPrice);
    }
  };

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

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    console.log('Sending message:', inputValue);
    addMessage(inputValue, 'user');
    setInputValue('');
    setIsThinking(true);
    
    try {
      const normalizedQuery = inputValue.toLowerCase();
      const normalizedShippingQuery = normalizeShippingService(normalizedQuery);
      
      // Handle FedEx-related queries with better recognition
      if (normalizedShippingQuery === 'fedex' && 
          (normalizedQuery.includes('properties') || normalizedQuery.includes('near') || 
           normalizedQuery.includes('close to') || normalizedQuery.includes('by') || 
           normalizedQuery.includes('around'))) {
        console.log('Detected FedEx property search query');
        handleFedExPropertySearch();
      }
      
      if (useAI && openAIKey) {
        console.log('Using AI mode with OpenAI API');
        const systemPrompt = formatPropertyAssistantPrompt(
          properties.length, 
          pois.length, 
          activeProperty ? { name: activeProperty.name, id: activeProperty.id } : null
        );

        const chatHistory: ChatMessage[] = [
          { role: 'system', content: systemPrompt },
          ...messages.slice(-10).map(msg => ({
            role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
            content: msg.content
          })),
          { role: 'user', content: inputValue }
        ];

        try {
          console.log(`Calling OpenAI API with model: ${selectedModel}`);
          const aiResponse = await getOpenAIResponse(chatHistory, openAIKey, selectedModel);
          
          console.log('Received AI response:', aiResponse.substring(0, 100) + '...');
          
          // Process property references in response
          const propertyRegex = /I'll use\s+([^.]+)\s+as our reference property/i;
          const propertyMatch = aiResponse.match(propertyRegex);
          
          if (propertyMatch) {
            const propertyName = propertyMatch[1].trim();
            const foundProperty = findBestPropertyMatch(propertyName, properties);
            
            if (foundProperty) {
              setActiveProperty(foundProperty);
              onSelectProperty(foundProperty);
              console.log('Selected property from AI response:', foundProperty.name);
              toast({
                title: "Property Selected",
                description: `Now using ${foundProperty.name} as the active property.`,
              });
            }
          }
          
          // Process POI references in response with improved parsing
          const poiRegex = /I found\s+(\d+)\s+([^.]+)\s+locations near\s+([^.]+)/i;
          const poiMatch = aiResponse.match(poiRegex);
          
          if (poiMatch && activeProperty) {
            const poiType = normalizeShippingService(poiMatch[2].trim().toLowerCase());
            const matchingPois = findMatchingPOIs(poiType, pois);
            
            if (matchingPois.length > 0) {
              const distance = 5 * 1.60934; // 5 miles to km
              const nearbyPois = findPOIsNearProperty(matchingPois, activeProperty, distance);
              
              if (nearbyPois.length > 0) {
                onShowPOIs(nearbyPois);
                console.log('Showing POIs near property:', nearbyPois.length, poiType, 'locations');
                toast({
                  title: `Found ${nearbyPois.length} locations`,
                  description: `Showing ${poiType} locations near ${activeProperty.name}`,
                });
              }
            }
          }
          
          addMessage(aiResponse, 'bot');
        } catch (error) {
          console.error('Error getting AI response:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.log('Falling back to local responses due to error:', errorMessage);
          
          const fallbackResponse = 'Sorry, I had trouble connecting to my AI brain. Using local responses instead...\n\n' + 
                                  generateAIResponse(inputValue);
          addMessage(fallbackResponse, 'bot');
        }
      } else {
        console.log('Using local response generation (no AI)');
        setTimeout(() => {
          const response = generateAIResponse(inputValue);
          addMessage(response, 'bot');
        }, Math.random() * 800 + 300);
      }
    } catch (error) {
      console.error('Error in message handling:', error);
      addMessage("I'm sorry, I encountered an error processing your request. Please try again.", 'bot');
    } finally {
      setIsThinking(false);
    }
  };

  const handleFedExPropertySearch = () => {
    console.log('Executing FedEx property search');
    
    const fedexLocations = pois.filter(poi => 
      poi.name.toLowerCase().includes('fedex') ||
      (poi.type.toLowerCase().includes('shipping') && poi.name.toLowerCase().includes('fedex'))
    );
    
    console.log(`Found ${fedexLocations.length} FedEx locations`);
    
    if (fedexLocations.length === 0) {
      addMessage("I couldn't find any FedEx locations in the database.", 'bot');
      return;
    }
    
    const maxDistanceKm = 8; // 5 miles
    const propertiesNearFedEx = findPropertiesNearPOIType(
      properties,
      pois,
      'fedex',
      maxDistanceKm
    );
    
    console.log(`Found ${propertiesNearFedEx.length} properties near FedEx locations`);
    
    onShowPOIs(fedexLocations);
    
    if (onShowPropertiesNearFedEx) {
      onShowPropertiesNearFedEx();
    }
    
    if (propertiesNearFedEx.length > 0) {
      const selectedProperty = propertiesNearFedEx[0];
      setActiveProperty(selectedProperty);
      onSelectProperty(selectedProperty);
      
      const propertyLinks = propertiesNearFedEx.slice(0, 5).map(p => 
        `<a href="#" class="text-primary hover:underline" data-property-id="${p.id}">${p.name}</a>`
      ).join(', ');
      
      toast({
        title: `Found ${propertiesNearFedEx.length} properties`,
        description: `Properties near FedEx locations`,
      });
      
      addMessage(
        `I found ${propertiesNearFedEx.length} properties near FedEx locations. I've marked FedEx locations on the map. Here are some nearby properties: ${propertyLinks}.`,
        'bot'
      );
    } else {
      addMessage(
        "I found FedEx locations but couldn't find any properties within 5 miles of them. I've marked the FedEx locations on the map.",
        'bot'
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleCloseChat = () => {
    if (embedded) return;
    
    localStorage.removeItem(STORAGE_KEY);
    setMessages([{
      id: '1',
      content: "Hello! I'm your property assistant powered by AI. Ask me about warehouses or points of interest nearby.",
      sender: 'bot',
      timestamp: new Date()
    }]);
    setActiveProperty(null);
    setIsOpen(false);
  };

  const toggleApiKeyInput = () => {
    setShowApiKeyInput(!showApiKeyInput);
  };

  const handleApiKeyChange = (apiKey: string) => {
    setOpenAIKey(apiKey);
    setUseAI(!!apiKey);
    if (apiKey) {
      setShowApiKeyInput(false);
      console.log('API key updated, AI mode:', !!apiKey);
    }
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    console.log('Model updated:', model);
  };

  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    console.log("Processing local query:", lowerQuery);
    
    // Handle shipping queries with better fuzzy matching
    const normalizedShippingQuery = normalizeShippingService(lowerQuery);
    
    if ((normalizedShippingQuery === 'fedex') && 
        (lowerQuery.includes('properties') || lowerQuery.includes('near') || 
         lowerQuery.includes('close to') || lowerQuery.includes('by') || 
         lowerQuery.includes('around'))) {
      
      console.log('Processing FedEx property search in local response generator');
      setTimeout(() => {
        handleFedExPropertySearch();
      }, 100);
      
      return "Looking for properties near FedEx locations...";
    }
    
    // Extract potential POI types to handle fuzzy queries
    const possiblePOITypes = extractPOITypes(lowerQuery);
    if (possiblePOITypes.length > 0 && 
        (lowerQuery.includes('near') || lowerQuery.includes('close') || 
         lowerQuery.includes('around') || lowerQuery.includes('find') || 
         lowerQuery.includes('show'))) {
           
      if (activeProperty) {
        const poiType = normalizeShippingService(possiblePOITypes[0]);
        const matchingPois = findMatchingPOIs(poiType, pois);
        
        if (matchingPois.length > 0) {
          const distance = 5 * 1.60934; // 5 miles to km
          const nearbyPois = findPOIsNearProperty(matchingPois, activeProperty, distance);
          
          if (nearbyPois.length > 0) {
            setTimeout(() => {
              onShowPOIs(nearbyPois);
              toast({
                title: `Found ${nearbyPois.length} locations`,
                description: `Showing ${poiType} locations near ${activeProperty.name}`,
              });
            }, 100);
            
            const poiLinks = nearbyPois.slice(0, 5).map(poi => {
              const dist = calculateDistance(activeProperty.latitude, activeProperty.longitude, poi.latitude, poi.longitude);
              const distStr = lowerQuery.includes('kilometer') || lowerQuery.includes('km') 
                ? `${dist.toFixed(1)} km` 
                : `${kmToMiles(dist).toFixed(1)} miles`;
              
              return `<a href="#" class="text-primary hover:underline" data-poi-id="${poi.id}">${poi.name}</a> (${distStr})`;
            }).join(', ');
            
            return `I found ${nearbyPois.length} ${poiType} locations near ${activeProperty.name}. Here are the closest ones: ${poiLinks}.`;
          }
        }
      }
    }
    
    if (/^(hi|hello|hey|greetings|howdy)/.test(lowerQuery)) {
      const greetings = [
        "Hello! How can I help you find the perfect property today?",
        "Hi there! I can help you explore properties and locations. What are you looking for?",
        "Hey! I'm here to assist with your property search. What would you like to know?",
        "Greetings! Looking for warehouse properties or information about locations? I'm here to help."
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    if (lowerQuery.includes("property") && (lowerQuery.includes("use") || lowerQuery.includes("select") || lowerQuery.includes("looking at"))) {
      const propertyNames = properties.map(p => p.name.toLowerCase());
      
      const mentionedProperty = propertyNames.find(name => lowerQuery.includes(name));
      
      if (mentionedProperty) {
        const matchedProperty = properties.find(p => 
          p.name.toLowerCase() === mentionedProperty
        );
        
        if (matchedProperty) {
          setActiveProperty(matchedProperty);
          onSelectProperty(matchedProperty);
          toast({
            title: "Property Selected",
            description: `Now using ${matchedProperty.name} as the active property.`,
          });
          return `I'll now use ${matchedProperty.name} as our reference property for your questions. What would you like to know about it or places nearby?`;
        }
      }
      
      const propertyContextRegex = /(?:use|set|consider|select|about|looking at|for)\s+(?:property|warehouse|building)(?:\s+called|:|\s+named)?\s+['"]?([^'".,!?]+)['"]?/i;
      const propertyMatch = lowerQuery.match(propertyContextRegex);
      
      if (propertyMatch) {
        const propertyName = propertyMatch[1].trim();
        const fuzzyMatch = findBestPropertyMatch(propertyName, properties);
        
        if (fuzzyMatch) {
          setActiveProperty(fuzzyMatch);
          onSelectProperty(fuzzyMatch);
          toast({
            title: "Property Selected",
            description: `Now using ${fuzzyMatch.name} as the active property.`,
          });
          return `I'll use ${fuzzyMatch.name} as our reference property. What information would you like about this property or its surroundings?`;
        } else {
          return `I couldn't find a property named "${propertyName}". Could you provide a different name or be more specific?`;
        }
      }
    }
    
    if ((lowerQuery.includes("find") || lowerQuery.includes("show") || lowerQuery.includes("where") || 
        lowerQuery.includes("nearby") || lowerQuery.includes("close") || lowerQuery.includes("around")) && 
        activeProperty) {
          
      const poiTypeRegex = /(?:find|show|are there|any|where is|location of|nearest)\s+(\w+(?:\s+\w+)*)\s+(?:near|around|close to|by|within)/i;
      const poiMatch = lowerQuery.match(poiTypeRegex);
      
      if (poiMatch) {
        const poiType = poiMatch[1].trim().toLowerCase();
        
        const distanceRegex = /within\s+(\d+(?:\.\d+)?)\s*(miles?|mi|kilometers?|km)/i;
        const distanceMatch = lowerQuery.match(distanceRegex);
        
        let distance = 5 * 1.60934;
        
        if (distanceMatch) {
          distance = parseFloat(distanceMatch[1]);
          
          if (distanceMatch[2].includes('mile') || distanceMatch[2].includes('mi')) {
            distance = distance * 1.60934;
          }
        }
        
        const matchingPois = findMatchingPOIs(poiType, pois);
        
        if (matchingPois.length === 0) {
          return `I couldn't find any locations matching "${poiType}". Try something like "restaurants", "coffee shops", or specific brands like "FedEx".`;
        }
        
        const nearbyPois = findPOIsNearProperty(matchingPois, activeProperty, distance);
        
        if (nearbyPois.length === 0) {
          const distanceInMiles = kmToMiles(distance).toFixed(1);
          return `I couldn't find any ${poiType} locations within ${distanceInMiles} miles of ${activeProperty.name}. Would you like to increase the search radius or look for something else?`;
        }
        
        nearbyPois.sort((a, b) => {
          const distA = calculateDistance(activeProperty.latitude, activeProperty.longitude, a.latitude, a.longitude);
          const distB = calculateDistance(activeProperty.latitude, activeProperty.longitude, b.latitude, b.longitude);
          return distA - distB;
        });
        
        onShowPOIs(nearbyPois);
        
        if (["fedex", "ups", "usps", "post office", "shipping"].includes(poiType) && nearbyPois.length > 0) {
          onSelectPOI(nearbyPois[0]);
        }
        
        toast({
          title: `Found ${nearbyPois.length} locations`,
          description: `Showing ${poiType} locations near ${activeProperty.name}`,
        });
        
        const poiLinks = nearbyPois.slice(0, 5).map(poi => {
          const dist = calculateDistance(activeProperty.latitude, activeProperty.longitude, poi.latitude, poi.longitude);
          const distStr = lowerQuery.includes('kilometer') || lowerQuery.includes('km') 
            ? `${dist.toFixed(1)} km` 
            : `${kmToMiles(dist).toFixed(1)} miles`;
          
          return `<a href="#" class="text-primary hover:underline" data-poi-id="${poi.id}">${poi.name}</a> (${distStr})`;
        }).join(', ');
        
        const responses = [
          `I found ${nearbyPois.length} ${poiType} locations near ${activeProperty.name} and marked them on the map. Here are the closest ones: ${poiLinks}.`,
          `There are ${nearbyPois.length} ${poiType} locations near ${activeProperty.name}. I've added them to the map. The closest ones are: ${poiLinks}.`,
          `Great news! I discovered ${nearbyPois.length} ${poiType} locations around ${activeProperty.name}. Take a look at: ${poiLinks}.`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    
    if (lowerQuery.includes("properties") || lowerQuery.includes("warehouses")) {
      if (lowerQuery.includes("size") || lowerQuery.includes("square feet") || lowerQuery.includes("sq ft")) {
        const sizeRegex = /(\d+(?:,\d+)*)/g;
        const sizeMatches = lowerQuery.match(sizeRegex);
        
        if (sizeMatches && sizeMatches.length > 0) {
          const targetSizeStr = sizeMatches[0].replace(/,/g, '');
          const targetSize = parseInt(targetSizeStr, 10);
          
          if (!isNaN(targetSize)) {
            const matchedProperties = filterPropertiesBySize(targetSize, properties);
            
            if (matchedProperties.length === 0) {
              return `I couldn't find any properties with a size around ${targetSize.toLocaleString()} sq ft. Would you like to try a different size range?`;
            }
            
            const propertiesStr = matchedProperties.slice(0, 5).map(p => 
              `<a href="#" class="text-primary hover:underline" data-property-id="${p.id}">${p.name}</a> (${p.size.toLocaleString()} sq ft)`
            ).join(', ');
            
            toast({
              title: `Found ${matchedProperties.length} properties`,
              description: `Properties with size around ${targetSize.toLocaleString()} sq ft`,
            });
            
            return `I found ${matchedProperties.length} properties with size around ${targetSize.toLocaleString()} sq ft. Here are some matches: ${propertiesStr}. Click on any property to see more details.`;
          }
        }
      }
      
      if (lowerQuery.includes("price") || lowerQuery.includes("cost") || lowerQuery.includes("$")) {
        const priceRegex = /\$?(\d+(?:,\d+)*(?:\.\d+)?)(?: ?[kK]| ?[mM]| ?[mM]illion| ?[tT]housand)?/g;
        const priceMatches = lowerQuery.match(priceRegex);
        
        if (priceMatches && priceMatches.length > 0) {
          const priceStr = priceMatches[0].replace(/[\$,]/g, '');
          let multiplier = 1;
          
          if (priceStr.toLowerCase().includes('k') || priceStr.toLowerCase().includes('thousand')) {
            multiplier = 1000;
          } else if (priceStr.toLowerCase().includes('m') || priceStr.toLowerCase().includes('million')) {
            multiplier = 1000000;
          }
          
          const numericPart = priceStr.replace(/[kKmM]|[tT]housand|[mM]illion/g, '');
          const targetPrice = parseFloat(numericPart) * multiplier;
          
          if (!isNaN(targetPrice)) {
            let comparisonType: PriceComparisonType = "around";
            if (lowerQuery.includes("under") || lowerQuery.includes("below") || lowerQuery.includes("less than")) {
              comparisonType = "below";
            } else if (lowerQuery.includes("above") || lowerQuery.includes("over") || lowerQuery.includes("more than")) {
              comparisonType = "above";
            }
            
            const matchedProperties = filterPropertiesByPrice(targetPrice, comparisonType, properties);
            
            if (matchedProperties.length === 0) {
              return `I couldn't find any properties with a price ${comparisonType} $${targetPrice.toLocaleString()}. Would you like to try a different price range?`;
            }
            
            const propertiesStr = matchedProperties.slice(0, 5).map(p => 
              `<a href="#" class="text-primary hover:underline" data-property-id="${p.id}">${p.name}</a> ($${p.price.toLocaleString()})`
            ).join(', ');
            
            toast({
              title: `Found ${matchedProperties.length} properties`,
              description: `Properties with price ${comparisonType} $${targetPrice.toLocaleString()}`,
            });
            
            const responses = [
              `I found ${matchedProperties.length} properties with price ${comparisonType} $${targetPrice.toLocaleString()}. Here are some matches: ${propertiesStr}.`,
              `There are ${matchedProperties.length} properties with price ${comparisonType} $${targetPrice.toLocaleString()}. Take a look at: ${propertiesStr}.`,
              `I've located ${matchedProperties.length} properties priced ${comparisonType} $${targetPrice.toLocaleString()}. Some options include: ${propertiesStr}.`
            ];
            
            return responses[Math.floor(Math.random() * responses.length)];
          }
        }
      }
      
      if (lowerQuery.includes("with")) {
        const featureRegex = /with\s+([a-zA-Z\s]+)(?:\.|\?|$)/i;
        const featureMatch = lowerQuery.match(featureRegex);
        
        if (featureMatch) {
          const feature = featureMatch[1].trim().toLowerCase();
          const matchedProperties = properties.filter(property => 
            property.features.some(f => f.toLowerCase().includes(feature))
          );
          
          if (matchedProperties.length === 0) {
            return `I couldn't find any properties with "${feature}" features. Some common features in our properties include loading docks, office space, and security systems.`;
          }
          
          const propertiesStr = matchedProperties.slice(0, 5).map(p => 
            `<a href="#" class="text-primary hover:underline" data-property-id="${p.id}">${p.name}</a>`
          ).join(', ');
          
          toast({
            title: `Found ${matchedProperties.length} properties`,
            description: `Properties with "${feature}" features`,
          });
          
          const responses = [
            `I found ${matchedProperties.length} properties with "${feature}" features. Here are some options: ${propertiesStr}.`,
            `There are ${matchedProperties.length} properties that include "${feature}" among their features. Some choices include: ${propertiesStr}.`,
            `I've identified ${matchedProperties.length} properties with "${feature}" features. Take a look at: ${propertiesStr}.`
          ];
          
          return responses[Math.floor(Math.random() * responses.length)];
        }
      }
      
      if (/^(show|list|display|tell me about) (all|the) (properties|warehouses)/.test(lowerQuery) || 
          /how many (properties|warehouses) (are there|do you have|are available)/.test(lowerQuery)) {
        const propertyLinks = properties.slice(0, 5).map(property => 
          `<a href="#" class="text-primary hover:underline" data-property-id="${property.id}">${property.name}</a>`
        ).join(', ');
        
        const responses = [
          `I have information on ${properties.length} properties. Here are a few examples: ${propertyLinks}.`,
          `There are ${properties.length} properties in our database. Some of them include: ${propertyLinks}.`,
          `We have ${properties.length} properties available. Examples include: ${propertyLinks}.`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    
    if (lowerQuery.includes("largest") || lowerQuery.includes("biggest")) {
      const largest = [...properties].sort((a, b) => b.size - a.size)[0];
      return `The largest property is <a href="#" class="text-primary hover:underline" data-property-id="${largest.id}">${largest.name}</a> with ${formatSize(largest.size)}. Would you like to know more about it?`;
    }
    
    if (lowerQuery.includes("smallest")) {
      const smallest = [...properties].sort((a, b) => a.size - b.size)[0];
      return `The smallest property is <a href="#" class="text-primary hover:underline" data-property-id="${smallest.id}">${smallest.name}</a> with ${formatSize(smallest.size)}. Would you prefer something larger or smaller?`;
    }
    
    if (lowerQuery.includes("most expensive") || lowerQuery.includes("highest price")) {
      const mostExpensive = [...properties].sort((a, b) => b.price - a.price)[0];
      return `The most expensive property is <a href="#" class="text-primary hover:underline" data-property-id="${mostExpensive.id}">${mostExpensive.name}</a> at ${formatPrice(mostExpensive.price)}. Is this within your budget range?`;
    }
    
    if (lowerQuery.includes("least expensive") || lowerQuery.includes("cheapest") || lowerQuery.includes("lowest price")) {
      const leastExpensive = [...properties].sort((a, b) => a.price - b.price)[0];
      return `The least expensive property is <a href="#" class="text-primary hover:underline" data-property-id="${leastExpensive.id}">${leastExpensive.name}</a> at ${formatPrice(leastExpensive.price)}. Would you like to view this property?`;
    }
    
    if (lowerQuery.includes("newest") || lowerQuery.includes("most recent")) {
      const newest = [...properties].sort((a, b) => b.year - a.year)[0];
      return `The newest property is <a href="#" class="text-primary hover:underline" data-property-id="${newest.id}">${newest.name}</a>, built in ${newest.year}. Would you like to know more about this property?`;
    }
    
    if (lowerQuery.includes("oldest")) {
      const oldest = [...properties].sort((a, b) => a.year - b.year)[0];
      return `The oldest property is <a href="#" class="text-primary hover:underline" data-property-id="${oldest.id}">${oldest.name}</a>, built in ${oldest.year}. Are you interested in historic properties?`;
    }
    
    if (lowerQuery.includes("average price") || lowerQuery.includes("median price")) {
      const avgPrice = properties.reduce((sum, prop) => sum + prop.price, 0) / properties.length;
      const responses = [
        `The average price of all properties is ${formatPrice(avgPrice)}.`,
        `Properties in our database have an average price of ${formatPrice(avgPrice)}.`,
        `The mean price across all properties is ${formatPrice(avgPrice)}.`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (lowerQuery.includes("average size") || lowerQuery.includes("median size")) {
      const avgSize = properties.reduce((sum, prop) => sum + prop.size, 0) / properties.length;
      return `The average size of all properties is ${formatSize(avgSize)}. Would you prefer something larger or smaller?`;
    }
    
    if (activeProperty) {
      const suggestions = [
        `You're currently looking at ${activeProperty.name}. You can ask things like:\n\n• "Find coffee shops within 2 miles of this property"\n• "Where is the nearest restaurant to this property?"\n• "Show me FedEx locations around this property"\n\nOr you can select a different property with "Use property [name]".`,
        `We're focused on ${activeProperty.name} right now. Try asking about:\n\n• "What restaurants are nearby?"\n• "Show shipping centers within 3 miles"\n• "Find the closest FedEx location"\n\nYou can also try a different property by saying "use property [name]".`
      ];
      return suggestions[Math.floor(Math.random() * suggestions.length)];
    }
    
    return "I'm not sure how to answer that. You can ask me about properties, their features, or points of interest near a specific property. Try selecting a property first by saying 'use property [name]'.";
  };

  const findBestPropertyMatch = (propertyName: string, properties: Property[]): Property | null => {
    if (!propertyName) return null;
    
    // Try exact match first
    const exactMatch = properties.find(p => 
      p.name.toLowerCase() === propertyName.toLowerCase()
    );
    
    if (exactMatch) return exactMatch;
    
    // Try partial match
    const partialMatch = properties.find(p => 
      p.name.toLowerCase().includes(propertyName.toLowerCase()) ||
      propertyName.toLowerCase().includes(p.name.toLowerCase())
    );
    
    if (partialMatch) return partialMatch;
    
    // Try fuzzy match if no exact or partial match found
    const bestMatch = findBestMatch(propertyName, properties.map(p => p.name));
    if (bestMatch) {
      return properties.find(p => p.name === bestMatch) || null;
    }
    
    return null;
  };
  
  const findMatchingPOIs = (poiType: string, pois: POI[]): POI[] => {
    if (!poiType) return [];
    
    // Normalize the POI type
    const normalizedType = normalizeShippingService(poiType.toLowerCase());
    
    // First try exact match
    const exactMatches = pois.filter(poi => 
      poi.type.toLowerCase() === normalizedType ||
      poi.name.toLowerCase().includes(normalizedType)
    );
    
    if (exactMatches.length > 0) return exactMatches;
    
    // Try fuzzy match for POI name or type
    return pois.filter(poi => {
      const poiNameMatch = findBestMatch(normalizedType, [poi.name.toLowerCase()]);
      const poiTypeMatch = findBestMatch(normalizedType, [poi.type.toLowerCase()]);
      return poiNameMatch !== null || poiTypeMatch !== null;
    });
  };

  return (
    <div className={`flex flex-col h-full border rounded-lg overflow-hidden ${embedded ? 'bg-background' : 'bg-background/80 backdrop-blur fixed bottom-6 right-6 w-96 shadow-lg z-50'}`}>
      {!embedded && (
        <div className="absolute right-4 top-4 z-10 flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleToggleExpand} className="h-8 w-8 rounded-full">
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleCloseChat} className="h-8 w-8 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b bg-primary text-primary-foreground">
        <Bot className="h-5 w-5" />
        <h3 className="font-semibold">Property Assistant</h3>
        {embedded && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleApiKeyInput}
            className="ml-auto text-xs h-7 px-2 hover:bg-primary-foreground/20 text-primary-foreground"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            {useAI ? 'AI Enabled' : 'Enable AI'}
          </Button>
        )}
      </div>
      
      {/* API Key Input Modal */}
      {showApiKeyInput && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleApiKeyInput} 
            className="absolute top-3 right-3 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
          <ApiKeyInput 
            apiKey={openAIKey} 
            onApiKeyChange={handleApiKeyChange}
            onModelChange={handleModelChange}
            selectedModel={selectedModel}
          />
        </div>
      )}
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id}
            className={`flex items-start ${message.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
          >
            {message.sender === 'bot' && (
              <div className="bg-muted w-8 h-8 rounded-full flex items-center justify-center mr-2">
                <Bot className="h-4 w-4" />
              </div>
            )}
            
            <div 
              className={`${
                message.sender === 'bot' 
                  ? 'bg-muted text-foreground mr-12' 
                  : 'bg-primary text-primary-foreground ml-12'
              } p-3 rounded-lg max-w-[85%]`}
            >
              <div dangerouslySetInnerHTML={{ __html: message.content }} />
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            
            {message.sender === 'user' && (
              <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center ml-2">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
        
        {isThinking && (
          <div className="flex items-start">
            <div className="bg-muted w-8 h-8 rounded-full flex items-center justify-center mr-2">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-muted text-foreground p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="h-2 w-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input Area */}
      <div className="p-3 border-t flex gap-2">
        <Input 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about properties or nearby POIs..."
          className="flex-1"
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={isThinking}
          size="icon"
          variant="default"
        >
          <SendHorizonal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Chatbot;
