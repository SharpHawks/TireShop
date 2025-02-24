import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  TIRE_CODES, 
  EFFICIENCY_RATINGS, 
  NOISE_RATINGS,
  TIRE_WIDTHS,
  TIRE_ASPECTS,
  TIRE_DIAMETERS
} from "@/lib/types";
import type { TireFilters } from "@shared/schema";
import { Fuel, Waves, Volume2, Info, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TireFiltersProps {
  filters: TireFilters;
  onFilterChange: (filters: TireFilters) => void;
}

const TIRE_SIZES = [
  "205/55R16",
  "215/55R16",
  "225/55R16",
  "205/60R16",
  "215/60R16",
  "225/45R17",
  "235/45R17",
  "245/45R17",
  "225/40R18",
  "235/40R18",
  "245/40R18",
  "255/35R19",
  "265/35R19",
  "275/35R19",
];

export function TireFilters({ filters, onFilterChange }: TireFiltersProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div className="space-y-6 p-6 bg-card rounded-lg">
      <div className="space-y-2">
        <Label>Tire Size</Label>
        <div className="grid grid-cols-3 gap-4">
          <Select
            value={filters.width}
            onValueChange={(value) =>
              onFilterChange({ ...filters, width: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Width" />
            </SelectTrigger>
            <SelectContent>
              {TIRE_WIDTHS.map((width) => (
                <SelectItem key={width.value} value={width.value}>
                  {width.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.aspect}
            onValueChange={(value) =>
              onFilterChange({ ...filters, aspect: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Aspect" />
            </SelectTrigger>
            <SelectContent>
              {TIRE_ASPECTS.map((aspect) => (
                <SelectItem key={aspect.value} value={aspect.value}>
                  {aspect.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.diameter}
            onValueChange={(value) =>
              onFilterChange({ ...filters, diameter: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Diameter" />
            </SelectTrigger>
            <SelectContent>
              {TIRE_DIAMETERS.map((diameter) => (
                <SelectItem key={diameter.value} value={diameter.value}>
                  {diameter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Quick Size Search</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {value
                ? TIRE_SIZES.find((size) => size === value)
                : "Search tire size..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search tire size..." value={value} onValueChange={setValue}/>
              <CommandEmpty>No tire size found.</CommandEmpty>
              <CommandGroup>
                {TIRE_SIZES.filter(size => 
                  !value || size.toLowerCase().includes(value.toLowerCase())
                ).map((size) => (
                  <CommandItem
                    key={size}
                    value={size}
                    onSelect={(currentValue) => {
                      setValue(currentValue);
                      setOpen(false);
                      const [width, rest] = currentValue.split('/');
                      const [aspect, diameter] = rest.split('R');
                      onFilterChange({
                        ...filters,
                        width,
                        aspect,
                        diameter
                      });
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === size ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {size}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

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