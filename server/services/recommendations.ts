import OpenAI from "openai";
import { Tire } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type UserPreferences = {
  drivingStyle?: string;
  weather?: string;
  budget?: string;
  vehicleType?: string;
}

interface RecommendationResponse {
  recommendedTireIds: number[];
}

function getFallbackRecommendations(userPreferences: UserPreferences, availableTires: Tire[]): Tire[] {
  let recommendations = [...availableTires];

  // Match season based on weather preference
  if (userPreferences.weather) {
    const season = userPreferences.weather.includes('snow') ? 'winter' : 'summer';
    recommendations = recommendations.filter(tire => tire.season === season);
  }

  // Match price range based on budget
  if (userPreferences.budget) {
    const priceRanges = {
      'economy': { min: 5000, max: 10000 }, // $50-100
      'mid_range': { min: 10000, max: 20000 }, // $100-200
      'premium': { min: 20000, max: 30000 }, // $200-300
      'luxury': { min: 30000, max: Infinity } // $300+
    };
    const range = priceRanges[userPreferences.budget as keyof typeof priceRanges];
    if (range) {
      recommendations = recommendations.filter(
        tire => tire.price >= range.min && tire.price <= range.max
      );
    }
  }

  // Match performance characteristics based on driving style
  if (userPreferences.drivingStyle) {
    switch (userPreferences.drivingStyle) {
      case 'sporty':
        recommendations.sort((a, b) => 
          (b.wetGrip.charCodeAt(0) - a.wetGrip.charCodeAt(0)) // Better wet grip
        );
        break;
      case 'eco':
        recommendations.sort((a, b) => 
          (b.fuelEfficiency.charCodeAt(0) - a.fuelEfficiency.charCodeAt(0)) // Better fuel efficiency
        );
        break;
      case 'comfort':
        recommendations.sort((a, b) => 
          (a.noiseLevel - b.noiseLevel) // Lower noise level
        );
        break;
      // 'normal' doesn't need special sorting
    }
  }

  // Prioritize in-stock items
  recommendations.sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0));

  return recommendations.slice(0, 5); // Return top 5 recommendations
}

export async function getTireRecommendations(
  userPreferences: UserPreferences,
  availableTires: Tire[]
): Promise<Tire[]> {
  try {
    const prompt = `As a tire recommendation expert, analyze these user preferences and recommend the best matching tires from the available options. 
    User preferences: ${JSON.stringify(userPreferences)}
    Available tires: ${JSON.stringify(availableTires)}

    Consider the following factors:
    - Driving style (${userPreferences.drivingStyle})
    - Weather conditions (${userPreferences.weather})
    - Budget range (${userPreferences.budget})
    - Vehicle type (${userPreferences.vehicleType})

    Return the response as a JSON array containing the IDs of the recommended tires in order of relevance.
    Format: { "recommendedTireIds": [1, 2, 3] }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    if (!response.choices[0].message.content) {
      console.log('No OpenAI response content, using fallback recommendations');
      return getFallbackRecommendations(userPreferences, availableTires);
    }

    const result = JSON.parse(response.choices[0].message.content) as RecommendationResponse;
    const recommendedTireIds = result.recommendedTireIds;

    // Map the recommended tire IDs to actual tire objects
    const recommendations = recommendedTireIds
      .map(id => availableTires.find(tire => tire.id === id))
      .filter((tire): tire is Tire => tire !== undefined)
      .slice(0, 5); // Limit to 5 recommendations

    return recommendations.length > 0 ? recommendations : getFallbackRecommendations(userPreferences, availableTires);
  } catch (error) {
    console.error('Error getting tire recommendations:', error);
    return getFallbackRecommendations(userPreferences, availableTires);
  }
}