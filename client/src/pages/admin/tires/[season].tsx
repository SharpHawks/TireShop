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
import { Input } from "@/components/ui/input";
import { Plus, ArrowLeft, Pencil, Save, Trash2, X } from "lucide-react";
import { Link } from "wouter";
import type { Tire } from "@shared/schema";
import { TireList } from "@/components/tire-list";

export default function SeasonalTires() {
  const { season } = useParams<{ season: string }>();
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedModel, setSelectedModel] = useState<string>("all");
  const [isEditingBrand, setIsEditingBrand] = useState(false);
  const [isEditingModel, setIsEditingModel] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newModelName, setNewModelName] = useState("");

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
    if (selectedBrand === "all") return [];
    return Array.from(new Set(
      seasonalTires
        .filter(tire => tire.brand === selectedBrand)
        .map(tire => tire.name)
    )).sort();
  }, [selectedBrand, seasonalTires]);

  // Filter tires based on selection
  const filteredTires = useMemo(() => {
    let filtered = seasonalTires;
    if (selectedBrand !== "all") {
      filtered = filtered.filter(tire => tire.brand === selectedBrand);
    }
    if (selectedModel !== "all") {
      filtered = filtered.filter(tire => tire.name === selectedModel);
    }
    return filtered;
  }, [seasonalTires, selectedBrand, selectedModel]);

  const handleSaveBrand = () => {
    // TODO: Implement brand save logic
    setIsEditingBrand(false);
    setNewBrandName("");
  };

  const handleSaveModel = () => {
    // TODO: Implement model save logic
    setIsEditingModel(false);
    setNewModelName("");
  };

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
          {/* Brand Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Brands</label>
              <div className="flex gap-2">
                {isEditingBrand ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingBrand(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSaveBrand}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingBrand(true)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={selectedBrand === "all"}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={selectedBrand === "all"}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            {isEditingBrand ? (
              <Input
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="Enter new brand name"
              />
            ) : (
              <Select
                value={selectedBrand}
                onValueChange={setSelectedBrand}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map(brand => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Model Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Models</label>
              <div className="flex gap-2">
                {isEditingModel ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingModel(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSaveModel}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingModel(true)}
                      disabled={selectedBrand === "all"}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={selectedModel === "all"}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={selectedModel === "all"}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            {isEditingModel ? (
              <Input
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
                placeholder="Enter new model name"
                disabled={selectedBrand === "all"}
              />
            ) : (
              <Select
                value={selectedModel}
                onValueChange={setSelectedModel}
                disabled={selectedBrand === "all"}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    selectedBrand === "all"
                      ? "Select a brand first"
                      : "Choose a model"
                  } />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Models</SelectItem>
                  {models.map(model => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </Card>

      <TireList tires={filteredTires} />
    </div>
  );
}