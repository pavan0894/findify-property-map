
export const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function getOpenAIResponse(
  messages: ChatMessage[],
  apiKey: string,
  model: string = 'gpt-4o-mini'
): Promise<string> {
  try {
    console.log('Sending request to OpenAI API with model:', model);
    console.log('Number of messages in history:', messages.length);
    
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
        stream: false // Ensure streaming is off to get complete responses
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      
      // Handle specific error types
      if (errorData.error?.type === 'insufficient_quota') {
        throw new Error('Your OpenAI API key has exceeded its quota. Please check your billing details or try again later.');
      } else if (errorData.error?.type === 'invalid_request_error') {
        throw new Error(`Invalid request: ${errorData.error?.message || 'Unknown error'}`);
      } else if (errorData.error?.code === 'rate_limit_exceeded') {
        throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
      } else {
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }
    }

    const data = await response.json();
    console.log('Received response from OpenAI API');
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to get response from OpenAI');
  }
}

// Add a type definition for the comparison type
export type PriceComparisonType = 'below' | 'above' | 'around';

// Property-specific utility types
export interface PropertyQuery {
  priceRange?: { min?: number; max?: number };
  sizeRange?: { min?: number; max?: number };
  features?: string[];
  yearBuilt?: { min?: number; max?: number };
  location?: { lat: number; lng: number; radiusInKm?: number };
}

// POI-specific utility types
export interface POIQuery {
  type?: string;
  name?: string;
  distanceToProperty?: number; // in kilometers
  propertyId?: string;
}

// Function to format the system prompt for property assistant
export function formatPropertyAssistantPrompt(
  propertiesCount: number,
  poisCount: number,
  activeProperty?: { name: string; id: string } | null
): string {
  return `You are a property assistant AI helping with a real estate application. 
You have access to ${propertiesCount} properties and ${poisCount} points of interest.
${activeProperty ? `The user is currently looking at ${activeProperty.name}.` : 'The user has not selected a specific property yet.'}

Your primary functions:
1. Help find properties matching specific criteria (size, price, features)
2. Locate points of interest near properties (especially shipping centers like FedEx, UPS, airports)
3. Provide information about properties

Special commands you should recognize:
- If a user wants to select a property, respond with "I'll use [PROPERTY_NAME] as our reference property."
- If a user wants to find nearby locations, respond with "I found [NUMBER] [TYPE] locations near [PROPERTY_NAME]."

When asked about shipping or delivery options:
- Highlight FedEx, UPS, USPS, and airport options near properties
- Provide distances to shipping centers when relevant
- Mention benefits of proximity to these services for business operations

Handle dynamic and complex questions by:
- Breaking down multi-part questions and addressing each part
- Recognizing misspelled location or property names (like "fedec" instead of "fedex")
- Understanding context from previous messages
- Identifying intent even when phrasing is unclear or contains typos

For ambiguous requests:
- Ask clarifying questions to better understand user needs
- Suggest possible interpretations of their request
- Provide examples of how to phrase their query more clearly

If the user asks about general information outside your property database:
- Acknowledge you don't have direct access to that information
- Suggest relevant property features that might address their needs
- For POI questions outside your database, suggest looking at nearby options visible on the map

IMPORTANT: RESPOND QUICKLY AND WITH A CONVERSATIONAL TONE. KEEP YOUR RESPONSES BRIEF AND FOCUSED ON THE USER'S QUESTION.

Be helpful, conversational, and focus on property information.`;
}

// Helper function to process misspelled or partial queries
export function findBestMatch(query: string, possibleMatches: string[]): string | null {
  if (!query || !possibleMatches || possibleMatches.length === 0) return null;
  
  const lowerQuery = query.toLowerCase().trim();
  
  // Exact match
  const exactMatch = possibleMatches.find(match => 
    match.toLowerCase() === lowerQuery
  );
  
  if (exactMatch) return exactMatch;
  
  // Contains match
  const containsMatch = possibleMatches.find(match => 
    match.toLowerCase().includes(lowerQuery) || 
    lowerQuery.includes(match.toLowerCase())
  );
  
  if (containsMatch) return containsMatch;
  
  // Fuzzy match - check if at least 70% of characters match
  for (const match of possibleMatches) {
    const lowerMatch = match.toLowerCase();
    let matchCount = 0;
    
    // Simple character match count
    for (let i = 0; i < Math.min(lowerQuery.length, lowerMatch.length); i++) {
      if (lowerQuery[i] === lowerMatch[i]) matchCount++;
    }
    
    const similarityScore = matchCount / Math.max(lowerQuery.length, lowerMatch.length);
    if (similarityScore >= 0.7) return match;
  }
  
  return null;
}

// Process potential POI types from user input
export function extractPOITypes(query: string): string[] {
  const lowerQuery = query.toLowerCase();
  const poiTypes = [
    'fedex', 'fed ex', 'federal express',
    'ups', 'united parcel service',
    'usps', 'post office', 'postal service',
    'airport', 'shipping', 'logistics',
    'restaurant', 'cafe', 'coffee', 'starbucks',
    'hotel', 'gas station', 'grocery', 'supermarket',
    'bank', 'atm', 'school', 'hospital', 'pharmacy',
    'park', 'gym', 'fitness'
  ];
  
  return poiTypes.filter(type => lowerQuery.includes(type));
}

// Helper to normalize common shipping service variations
export function normalizeShippingService(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('fedex') || lowerQuery.includes('fed ex') || 
      lowerQuery.includes('federal express') || lowerQuery.includes('fedec')) {
    return 'fedex';
  }
  
  if (lowerQuery.includes('ups') || lowerQuery.includes('united parcel')) {
    return 'ups';
  }
  
  if (lowerQuery.includes('usps') || lowerQuery.includes('post office') || 
      lowerQuery.includes('postal service')) {
    return 'usps';
  }
  
  return query;
}
