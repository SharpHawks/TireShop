import { useParams } from "wouter";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import type { Tire, Brand, Model } from "@shared/schema";
import { TireList } from "@/components/tire-list";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function SeasonalTires() {
  const { season } = useParams<{ season: string }>();
  const { toast } = useToast();
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedModel, setSelectedModel] = useState<string>("all");
  const [isEditingBrand, setIsEditingBrand] = useState(false);
  const [isEditingModel, setIsEditingModel] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newModelName, setNewModelName] = useState("");

  // Fetch brands
  const { data: brands = [], isLoading: isBrandsLoading } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  });

  // Fetch all models
  const { data: allModels = [], isLoading: isModelsLoading } = useQuery<Model[]>({
    queryKey: ["/api/models"],
    enabled: selectedBrand !== "all",
  });

  // Filter models for selected brand
  const models = selectedBrand === "all"
    ? []
    : allModels.filter(model => model.brandId === Number(selectedBrand));

  // Fetch tires
  const { data: tires = [], isLoading: isTiresLoading } = useQuery<Tire[]>({
    queryKey: ["/api/tires"],
  });

  // Filter tires based on selection and season
  const filteredTires = tires.filter(tire => {
    let matches = tire.season === season;
    if (selectedBrand !== "all" && selectedModel === "all") {
      // If only brand is selected, show all tires from that brand's models
      const brandModels = models.map(model => model.id);
      matches = matches && brandModels.includes(tire.modelId);
    } else if (selectedModel !== "all") {
      // If model is selected, show only tires from that specific model
      matches = matches && tire.modelId === Number(selectedModel);
    }
    return matches;
  });

  // Brand mutations
  const createBrandMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error("Failed to create brand");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      setIsEditingBrand(false);
      setNewBrandName("");
      toast({
        title: "Success",
        description: "Brand created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Model mutations
  const createModelMutation = useMutation({
    mutationFn: async ({ name, brandId }: { name: string; brandId: number }) => {
      const response = await fetch("/api/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, brandId }),
      });
      if (!response.ok) throw new Error("Failed to create model");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands", selectedBrand, "models"] });
      setIsEditingModel(false);
      setNewModelName("");
      toast({
        title: "Success",
        description: "Model created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSaveBrand = () => {
    if (!newBrandName.trim()) {
      toast({
        title: "Error",
        description: "Brand name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    createBrandMutation.mutate(newBrandName);
  };

  const handleSaveModel = () => {
    if (!newModelName.trim()) {
      toast({
        title: "Error",
        description: "Model name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    if (selectedBrand === "all") {
      toast({
        title: "Error",
        description: "Please select a brand first",
        variant: "destructive",
      });
      return;
    }
    createModelMutation.mutate({
      name: newModelName,
      brandId: Number(selectedBrand),
    });
  };

  // Reset model selection when brand changes
  const handleBrandChange = (value: string) => {
    setSelectedBrand(value);
    setSelectedModel("all");
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
                      disabled={createBrandMutation.isPending}
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
                onValueChange={handleBrandChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map(brand => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.name}
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
                      disabled={createModelMutation.isPending}
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
                    <SelectItem key={model.id} value={model.id.toString()}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </Card>

      <TireList
        tires={filteredTires}
        models={models}
        isLoading={isTiresLoading || isBrandsLoading || (selectedBrand !== "all" && isModelsLoading)}
      />
    </div>
  );
}