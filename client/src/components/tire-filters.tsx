import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TIRE_CODES, EFFICIENCY_RATINGS } from "@/lib/types";
import type { TireFilters } from "@shared/schema";

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

      <div className="space-y-2">
        <Label>Fuel Efficiency</Label>
        <Select
          value={filters.fuelEfficiency}
          onValueChange={(value) =>
            onFilterChange({ ...filters, fuelEfficiency: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select rating" />
          </SelectTrigger>
          <SelectContent>
            {EFFICIENCY_RATINGS.map((rating) => (
              <SelectItem key={rating.value} value={rating.value}>
                {rating.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Maximum Noise Level (dB)</Label>
        <Slider
          value={[filters.maxNoiseLevel || 80]}
          min={60}
          max={80}
          step={1}
          onValueChange={([value]) =>
            onFilterChange({ ...filters, maxNoiseLevel: value })
          }
        />
      </div>
    </div>
  );
}
