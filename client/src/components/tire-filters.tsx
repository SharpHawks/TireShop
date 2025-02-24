import { useState, useEffect, useRef, KeyboardEvent } from "react";
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
import { Fuel, Waves, Volume2, Info, Sun, Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";

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

// Convert size with separators to simple format: "205/55R16" -> "2055516"
const formatToSimple = (size: string) => {
  return size.replace(/\/|R/g, '');
};

// Convert simple format to size with separators: "2055516" -> "205/55R16"
const formatToStandard = (simple: string) => {
  if (simple.length !== 7) return '';
  const width = simple.slice(0, 3);
  const aspect = simple.slice(3, 5);
  const diameter = simple.slice(5);
  return `${width}/${aspect}R${diameter}`;
};

// Add season constant
const TIRE_SEASONS = [
  { value: 'summer', label: 'Summer', icon: Sun },
  { value: 'winter', label: 'Winter', icon: Snowflake }
] as const;

export function TireFilters({ filters, onFilterChange }: TireFiltersProps) {
  const [searchValue, setSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);

  // Set summer tires as default when filters.season is undefined
  useEffect(() => {
    if (filters.season === undefined) {
      onFilterChange({
        ...filters,
        season: 'summer'
      });
    }
  }, []);

  const filteredSizes = TIRE_SIZES.filter(size => {
    const simpleInput = searchValue.replace(/\/|R/g, '');
    const simpleSize = formatToSimple(size);
    return simpleSize.startsWith(simpleInput);
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Add effect to scroll selected item into view
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [selectedIndex]);

  const handleSizeSelect = (size: string) => {
    const simpleSize = formatToSimple(size);
    setSearchValue(simpleSize);
    setShowDropdown(false);
    setSelectedIndex(-1);
    const [width, rest] = size.split('/');
    const [aspect, diameter] = rest.split('R');
    onFilterChange({
      ...filters,
      width,
      aspect,
      diameter
    });
  };

  const handleInputChange = (value: string) => {
    setSearchValue(value);
    setSelectedIndex(-1);

    // Show dropdown if we have input
    if (value) {
      setShowDropdown(true);

      // If we have a complete size, try to apply it
      if (/^\d{7}$/.test(value)) {
        const standardSize = formatToStandard(value);
        if (standardSize && TIRE_SIZES.includes(standardSize)) {
          handleSizeSelect(standardSize);
        }
      }
    } else {
      setShowDropdown(false);
      // Clear size filters if input is empty
      onFilterChange({
        ...filters,
        width: undefined,
        aspect: undefined,
        diameter: undefined
      });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || filteredSizes.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < filteredSizes.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredSizes.length) {
          handleSizeSelect(filteredSizes[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className="space-y-8 p-8 bg-card rounded-xl shadow-lg border">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Filter Tires</h2>
        <div className="h-px bg-border" />
      </div>

      <div className="space-y-3">
        <Label className="text-lg">Season</Label>
        <div className="grid grid-cols-2 gap-4">
          {TIRE_SEASONS.map(({ value, label, icon: Icon }) => (
            <div
              key={value}
              className={cn(
                "flex items-center justify-center gap-3 p-4 rounded-lg cursor-pointer border-2 transition-all hover:shadow-md",
                filters.season === value
                  ? "border-primary bg-primary/10 shadow-inner"
                  : "border-muted hover:border-primary/50"
              )}
              onClick={() =>
                onFilterChange({
                  ...filters,
                  season: filters.season === value ? undefined : value,
                })
              }
            >
              <Icon className="h-6 w-6" />
              <span className="font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-lg">Tire Size</Label>
        <div className="grid grid-cols-3 gap-4">
          <Select
            value={filters.width}
            onValueChange={(value) =>
              onFilterChange({ ...filters, width: value })
            }
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Width" />
            </SelectTrigger>
            <SelectContent 
              sideOffset={4} 
              position="popper" 
              className="z-50"
              align="start"
              avoidCollisions={true}
            >
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
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Aspect" />
            </SelectTrigger>
            <SelectContent 
              sideOffset={4} 
              position="popper" 
              className="z-50"
              align="start"
              avoidCollisions={true}
            >
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
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Diameter" />
            </SelectTrigger>
            <SelectContent 
              sideOffset={4} 
              position="popper" 
              className="z-50"
              align="start"
              avoidCollisions={true}
            >
              {TIRE_DIAMETERS.map((diameter) => (
                <SelectItem key={diameter.value} value={diameter.value}>
                  {diameter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3 relative" ref={dropdownRef}>
        <Label className="text-lg">Quick Size Search</Label>
        <Input
          type="text"
          placeholder="Type tire size (e.g. 2055516)"
          value={searchValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchValue) setShowDropdown(true);
          }}
          className="h-11"
        />
        {showDropdown && searchValue && (
          <div className="absolute w-full mt-1 bg-popover border rounded-lg shadow-lg z-50 max-h-[200px] overflow-y-auto">
            {filteredSizes.length > 0 ? (
              filteredSizes.map((size, index) => (
                <div
                  key={size}
                  ref={index === selectedIndex ? selectedItemRef : null}
                  className={cn(
                    "px-4 py-3 cursor-pointer transition-colors",
                    index === selectedIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                  )}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-muted-foreground">
                No matching sizes found
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Label className="text-lg">Availability</Label>
        <div className="flex items-center gap-3 p-4 bg-accent/20 rounded-lg">
          <Switch
            checked={filters.inStock}
            onCheckedChange={(checked) =>
              onFilterChange({ ...filters, inStock: checked })
            }
          />
          <span className="font-medium">In Stock Only</span>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg">Tire Codes</Label>
        <div className="grid grid-cols-2 gap-4">
          {TIRE_CODES.map((code) => (
            <TooltipProvider key={code.value}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
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
                      className="flex items-center gap-2 cursor-pointer"
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

      <div className="bg-accent/20 p-6 rounded-lg space-y-6">
        <div className="grid grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <Fuel className="h-8 w-8 text-primary" />
              <span className="mt-2 font-medium">Fuel Efficiency</span>
            </div>
            <div className="space-y-3">
              {EFFICIENCY_RATINGS.map((rating) => (
                <div key={rating.value} className="flex items-center justify-center gap-3">
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
                  <label htmlFor={`fuel-${rating.value}`} className="font-medium">{rating.label}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <Waves className="h-8 w-8 text-primary" />
              <span className="mt-2 font-medium">Wet Grip</span>
            </div>
            <div className="space-y-3">
              {EFFICIENCY_RATINGS.map((rating) => (
                <div key={rating.value} className="flex items-center justify-center gap-3">
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
                  <label htmlFor={`grip-${rating.value}`} className="font-medium">{rating.label}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <Volume2 className="h-8 w-8 text-primary" />
              <span className="mt-2 font-medium">Noise Level</span>
            </div>
            <div className="space-y-3">
              {NOISE_RATINGS.map((rating) => (
                <div key={rating.value} className="flex items-center justify-center gap-3">
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
                  <label htmlFor={`noise-${rating.value}`} className="font-medium">{rating.label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}