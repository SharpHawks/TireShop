import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const DRIVING_STYLES = [
  { value: "normal", label: "Normal / Daily Commute" },
  { value: "sporty", label: "Sporty / Performance" },
  { value: "comfort", label: "Comfort / Luxury" },
  { value: "eco", label: "Eco-friendly / Efficient" },
];

const WEATHER_CONDITIONS = [
  { value: "all_season", label: "All Season" },
  { value: "mostly_dry", label: "Mostly Dry" },
  { value: "rain_snow", label: "Rain and Snow" },
  { value: "extreme", label: "Extreme Conditions" },
];

const BUDGET_RANGES = [
  { value: "economy", label: "Economy ($50-100)" },
  { value: "mid_range", label: "Mid-range ($100-200)" },
  { value: "premium", label: "Premium ($200-300)" },
  { value: "luxury", label: "Luxury ($300+)" },
];

const VEHICLE_TYPES = [
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV / Crossover" },
  { value: "truck", label: "Truck" },
  { value: "sports", label: "Sports Car" },
  { value: "luxury", label: "Luxury Vehicle" },
];

interface PreferencesFormProps {
  onSubmit: (preferences: {
    drivingStyle: string;
    weather: string;
    budget: string;
    vehicleType: string;
  }) => void;
}

export function PreferencesForm({ onSubmit }: PreferencesFormProps) {
  const [preferences, setPreferences] = useState({
    drivingStyle: "",
    weather: "",
    budget: "",
    vehicleType: "",
  });

  const handleSubmit = () => {
    if (Object.values(preferences).every(value => value)) {
      onSubmit(preferences);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          Get Personalized Tire Recommendations
        </h2>
        <p className="text-muted-foreground">
          Tell us about your driving preferences and we'll recommend the perfect tires for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Driving Style</Label>
          <Select
            value={preferences.drivingStyle}
            onValueChange={(value) =>
              setPreferences({ ...preferences, drivingStyle: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your driving style" />
            </SelectTrigger>
            <SelectContent>
              {DRIVING_STYLES.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Weather Conditions</Label>
          <Select
            value={preferences.weather}
            onValueChange={(value) =>
              setPreferences({ ...preferences, weather: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select typical weather" />
            </SelectTrigger>
            <SelectContent>
              {WEATHER_CONDITIONS.map((condition) => (
                <SelectItem key={condition.value} value={condition.value}>
                  {condition.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Budget Range</Label>
          <Select
            value={preferences.budget}
            onValueChange={(value) =>
              setPreferences({ ...preferences, budget: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your budget" />
            </SelectTrigger>
            <SelectContent>
              {BUDGET_RANGES.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Vehicle Type</Label>
          <Select
            value={preferences.vehicleType}
            onValueChange={(value) =>
              setPreferences({ ...preferences, vehicleType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your vehicle type" />
            </SelectTrigger>
            <SelectContent>
              {VEHICLE_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={!Object.values(preferences).every(value => value)}
      >
        Get Recommendations
      </Button>
    </Card>
  );
}
