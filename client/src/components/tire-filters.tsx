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
import { TIRE_CODES, EFFICIENCY_RATINGS } from "@/lib/types";
import type { TireFilters } from "@shared/schema";
import { Fuel, Waves, Volume2 } from "lucide-react";

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

      <div className="space-y-2">
        <Label>Tire Code</Label>
        <Select
          value={filters.code}
          onValueChange={(value) =>
            onFilterChange({ ...filters, code: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select code" />
          </SelectTrigger>
          <SelectContent>
            {TIRE_CODES.map((code) => (
              <SelectItem key={code.value} value={code.value}>
                {code.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            <Label>Fuel Efficiency</Label>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {EFFICIENCY_RATINGS.map((rating) => (
              <div key={rating.value} className="flex items-center gap-2">
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

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Waves className="h-5 w-5" />
            <Label>Wet Grip</Label>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {EFFICIENCY_RATINGS.map((rating) => (
              <div key={rating.value} className="flex items-center gap-2">
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

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            <Label>Noise Level</Label>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {EFFICIENCY_RATINGS.map((rating) => (
              <div key={rating.value} className="flex items-center gap-2">
                <Checkbox
                  id={`noise-${rating.value}`}
                  checked={filters.maxNoiseLevel === 70 + 
                    (rating.value === 'A' ? 0 : rating.value === 'B' ? 5 : 10)}
                  onCheckedChange={(checked) =>
                    onFilterChange({
                      ...filters,
                      maxNoiseLevel: checked 
                        ? 70 + (rating.value === 'A' ? 0 : rating.value === 'B' ? 5 : 10)
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
  );
}