import { useParams } from "wouter";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { Tire } from "@shared/schema";
import { TireList } from "@/components/tire-list";

export default function SeasonalTires() {
  const { season } = useParams<{ season: string }>();
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");

  const { data: tires = [] } = useQuery<Tire[]>({
    queryKey: ["/api/tires"],
  });

  // Filter tires by season
  const seasonalTires = useMemo(() => 
    tires.filter(tire => tire.season === season),
    [tires, season]
  );

  // Get unique brands
  const brands = useMemo(() => 
    Array.from(new Set(seasonalTires.map(tire => tire.brand))).sort(),
    [seasonalTires]
  );

  // Get models for selected brand
  const models = useMemo(() => {
    if (!selectedBrand) return [];
    return seasonalTires
      .filter(tire => tire.brand === selectedBrand)
      .map(tire => tire.name)
      .sort();
  }, [selectedBrand, seasonalTires]);

  // Filter tires based on selection
  const filteredTires = useMemo(() => {
    let filtered = seasonalTires;
    if (selectedBrand) {
      filtered = filtered.filter(tire => tire.brand === selectedBrand);
    }
    if (selectedModel) {
      filtered = filtered.filter(tire => tire.name === selectedModel);
    }
    return filtered;
  }, [seasonalTires, selectedBrand, selectedModel]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/admin">
          <a className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </a>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold capitalize">
          {season} Tires Management
        </h1>
        <Link href="/admin/tires/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Tire
          </Button>
        </Link>
      </div>

      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Brand
            </label>
            <Select
              value={selectedBrand}
              onValueChange={setSelectedBrand}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Brands</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Model
            </label>
            <Select
              value={selectedModel}
              onValueChange={setSelectedModel}
              disabled={!selectedBrand}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  selectedBrand 
                    ? "Choose a model" 
                    : "Select a brand first"
                } />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Models</SelectItem>
                {models.map(model => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <TireList tires={filteredTires} />
    </div>
  );
}
