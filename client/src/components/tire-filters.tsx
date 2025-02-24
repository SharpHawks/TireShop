import { useState } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TIRE_CODES, EFFICIENCY_RATINGS, NOISE_RATINGS } from "@/lib/types";
import type { TireFilters } from "@shared/schema";
import { Fuel, Waves, Volume2, Info } from "lucide-react";

interface TireFiltersProps {
  filters: TireFilters;
  onFilterChange: (filters: TireFilters) => void;
}

export function TireFilters({ filters, onFilterChange }: TireFiltersProps) {
  return (
    <div className="space-y-6 p-6 bg-card rounded-lg">
      <div className="space-y-2">
        <Label>Availability</Label>
        <div className="flex items-center gap-2">
          <Switch
            checked={filters.inStock}
            onCheckedChange={(checked) =>
              onFilterChange({ ...filters, inStock: checked })
            }
          />
          <span>In Stock Only</span>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Tire Codes</Label>
        <div className="grid grid-cols-2 gap-4">
          {TIRE_CODES.map((code) => (
            <TooltipProvider key={code.value}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`code-${code.value}`}
                      checked={filters.code === code.value}
                      onCheckedChange={(checked) =>
                        onFilterChange({
                          ...filters,
                          code: checked ? code.value : undefined,
                        })
                      }
                    />
                    <label 
                      htmlFor={`code-${code.value}`}
                      className="flex items-center gap-1 cursor-pointer"
                    >
                      {code.label}
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </label>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{code.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>

      <div className="bg-accent/50 p-4 rounded-lg">
        <div className="grid grid-cols-3 gap-8">
          {/* Fuel Efficiency Column */}
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <Fuel className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              {EFFICIENCY_RATINGS.map((rating) => (
                <div key={rating.value} className="flex items-center justify-center gap-2">
                  <Checkbox
                    id={`fuel-${rating.value}`}
                    checked={filters.fuelEfficiency === rating.value}
                    onCheckedChange={(checked) =>
                      onFilterChange({
                        ...filters,
                        fuelEfficiency: checked ? rating.value : undefined,
                      })
                    }
                  />
                  <label htmlFor={`fuel-${rating.value}`}>{rating.label}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Wet Grip Column */}
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <Waves className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              {EFFICIENCY_RATINGS.map((rating) => (
                <div key={rating.value} className="flex items-center justify-center gap-2">
                  <Checkbox
                    id={`grip-${rating.value}`}
                    checked={filters.wetGrip === rating.value}
                    onCheckedChange={(checked) =>
                      onFilterChange({
                        ...filters,
                        wetGrip: checked ? rating.value : undefined,
                      })
                    }
                  />
                  <label htmlFor={`grip-${rating.value}`}>{rating.label}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Noise Level Column */}
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <Volume2 className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              {NOISE_RATINGS.map((rating) => (
                <div key={rating.value} className="flex items-center justify-center gap-2">
                  <Checkbox
                    id={`noise-${rating.value}`}
                    checked={filters.maxNoiseLevel === 
                      (rating.value === 'A' ? 70 : rating.value === 'B' ? 75 : 80)}
                    onCheckedChange={(checked) =>
                      onFilterChange({
                        ...filters,
                        maxNoiseLevel: checked 
                          ? (rating.value === 'A' ? 70 : rating.value === 'B' ? 75 : 80)
                          : undefined,
                      })
                    }
                  />
                  <label htmlFor={`noise-${rating.value}`}>{rating.label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}