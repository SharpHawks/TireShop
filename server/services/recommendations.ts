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
      throw new Error('No response content from OpenAI');
    }

    const result = JSON.parse(response.choices[0].message.content) as RecommendationResponse;
    const recommendedTireIds = result.recommendedTireIds;

    // Map the recommended tire IDs to actual tire objects
    const recommendations = recommendedTireIds
      .map(id => availableTires.find(tire => tire.id === id))
      .filter((tire): tire is Tire => tire !== undefined)
      .slice(0, 5); // Limit to 5 recommendations

    return recommendations;
  } catch (error) {
    console.error('Error getting tire recommendations:', error);
    return [];
  }
}