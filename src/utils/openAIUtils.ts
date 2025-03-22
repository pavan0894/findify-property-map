
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
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to get response from OpenAI');
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

Be helpful, conversational, and focus on property information.`;
}
