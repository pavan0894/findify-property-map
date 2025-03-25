
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send } from 'lucide-react';
import { Property, POI } from '@/utils/data';
import { toast } from '@/hooks/use-toast';
import { getOpenAIResponse, ChatMessage as OpenAIChatMessage, formatPropertyAssistantPrompt } from '@/utils/openAIUtils';

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

// OpenAI API key - in a real application, this would be fetched securely
// For demo purposes, we're using a state variable that can be set by the user
const DEFAULT_OPENAI_API_KEY = ''; // Empty by default

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
  const [apiKey, setApiKey] = useState<string>(DEFAULT_OPENAI_API_KEY);
  const [openAIMessages, setOpenAIMessages] = useState<OpenAIChatMessage[]>([]);
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(!DEFAULT_OPENAI_API_KEY);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize OpenAI chat history
  useEffect(() => {
    // System message with context about properties and POIs
    const systemMessage: OpenAIChatMessage = {
      role: 'system',
      content: formatPropertyAssistantPrompt(properties.length, pois.length)
    };
    
    setOpenAIMessages([systemMessage]);
  }, [properties.length, pois.length]);
  
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
  
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };
  
  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;
    
    setIsLoading(true);
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };
    
    // Add user message to chat history
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    
    // Check for direct property matches or POI types before sending to OpenAI
    const propertyMatch = findBestPropertyMatch(input, properties);
    const poiTypes = extractPOITypes(input);
    
    // Update OpenAI message history
    const userOpenAIMessage: OpenAIChatMessage = {
      role: 'user',
      content: input
    };
    setOpenAIMessages(prev => [...prev, userOpenAIMessage]);
    
    // Handle specific property requests directly
    if (propertyMatch) {
      const botResponse = `I found a property named ${propertyMatch.name}. Now focusing on this property.`;
      
      // Add bot response to chat
      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        text: botResponse,
        sender: 'bot',
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
      onSelectProperty(propertyMatch);
      
      // Add assistant response to OpenAI history
      const assistantMessage: OpenAIChatMessage = {
        role: 'assistant',
        content: botResponse
      };
      setOpenAIMessages(prev => [...prev, assistantMessage]);
      
      setIsLoading(false);
      return;
    }
    
    // Handle specific POI type requests directly
    if (poiTypes.length > 0) {
      const matchingPOIs = findMatchingPOIs(poiTypes[0], pois);
      if (matchingPOIs.length > 0) {
        const botResponse = `I found ${matchingPOIs.length} locations matching "${poiTypes[0]}". Showing them on the map.`;
        
        // Add bot response to chat
        const botMessage: ChatMessage = {
          id: Date.now().toString(),
          text: botResponse,
          sender: 'bot',
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
        onShowPOIs(matchingPOIs);
        
        // Add assistant response to OpenAI history
        const assistantMessage: OpenAIChatMessage = {
          role: 'assistant',
          content: botResponse
        };
        setOpenAIMessages(prev => [...prev, assistantMessage]);
        
        toast({
          title: `Found ${matchingPOIs.length} locations`,
          description: `Showing ${poiTypes[0]} locations on the map`
        });
        
        setIsLoading(false);
        return;
      }
    }
    
    // Check for FedEx/shipping requests
    const normalizedInput = input.toLowerCase();
    if (normalizedInput.includes('near') && (normalizedInput.includes('fedex') || normalizedInput.includes('shipping'))) {
      const normalizedShippingQuery = normalizeShippingService(normalizedInput);
      if (normalizedShippingQuery === 'fedex') {
        const botResponse = "Finding properties near FedEx locations...";
        
        // Add bot response to chat
        const botMessage: ChatMessage = {
          id: Date.now().toString(),
          text: botResponse,
          sender: 'bot',
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
        onShowPropertiesNearFedEx();
        
        // Add assistant response to OpenAI history
        const assistantMessage: OpenAIChatMessage = {
          role: 'assistant',
          content: botResponse
        };
        setOpenAIMessages(prev => [...prev, assistantMessage]);
        
        toast({
          title: "Finding Properties Near FedEx",
          description: "Showing properties with nearby FedEx locations"
        });
        
        setIsLoading(false);
        return;
      }
    }
    
    // For any other queries, get a response from OpenAI
    try {
      if (!apiKey) {
        setShowApiKeyInput(true);
        const botMessage: ChatMessage = {
          id: Date.now().toString(),
          text: "Please enter your OpenAI API key to enable AI responses. This key will only be stored in your browser.",
          sender: 'bot',
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
        setIsLoading(false);
        return;
      }
      
      // Get response from OpenAI
      const aiResponse = await getOpenAIResponse(openAIMessages, apiKey);
      
      // Add AI response to chat
      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        text: aiResponse,
        sender: 'bot',
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
      
      // Add AI response to OpenAI history
      const assistantMessage: OpenAIChatMessage = {
        role: 'assistant',
        content: aiResponse
      };
      setOpenAIMessages(prev => [...prev, assistantMessage]);
      
      // Process AI response for actions (property selection, POI display, etc.)
      processAIResponse(aiResponse);
      
    } catch (error) {
      console.error("Error getting OpenAI response:", error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      
      // Add error message to chat
      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `Sorry, I encountered an error: ${errorMessage}`,
        sender: 'bot',
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
      
      // Show toast with error
      toast({
        title: "AI Response Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, properties, pois, apiKey, openAIMessages, onSelectProperty, onShowPOIs, onShowPropertiesNearFedEx]);
  
  // Process AI responses for potential actions
  const processAIResponse = (response: string) => {
    // Check for property selection intent in AI response
    if (response.includes("I'll use") && response.includes("as our reference property")) {
      const propertyNameMatch = response.match(/I'll use ([^.]+) as our reference property/);
      if (propertyNameMatch && propertyNameMatch[1]) {
        const propertyName = propertyNameMatch[1].trim();
        const property = findBestPropertyMatch(propertyName, properties);
        if (property) {
          onSelectProperty(property);
          toast({
            title: "Property Selected",
            description: `Now focusing on ${property.name}`
          });
        }
      }
    }
    
    // Check for POI display intent in AI response
    if (response.includes("I found") && response.includes("locations near")) {
      const poiMatch = response.match(/I found (\d+) ([^\s]+) locations near/);
      if (poiMatch && poiMatch[2]) {
        const poiType = poiMatch[2].trim();
        const matchingPOIs = findMatchingPOIs(poiType, pois);
        if (matchingPOIs.length > 0) {
          onShowPOIs(matchingPOIs);
          toast({
            title: `Found ${matchingPOIs.length} locations`,
            description: `Showing ${poiType} locations on the map`
          });
        }
      }
    }
  };
  
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
        <ScrollArea className="h-full pr-4" ref={chatContainerRef}>
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
      
      {showApiKeyInput && (
        <div className="px-4 py-2 border-t">
          <div className="mb-2">
            <p className="text-sm text-muted-foreground mb-1">Enter your OpenAI API key to enable AI responses:</p>
            <Input
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={handleApiKeyChange}
              className="w-full"
            />
          </div>
          <div className="flex justify-between">
            <p className="text-xs text-muted-foreground">This key is only stored in your browser</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowApiKeyInput(false)} 
              disabled={!apiKey}
            >
              Save Key
            </Button>
          </div>
        </div>
      )}
      
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
