import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Copy,
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Tire, Model } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useState } from "react";

interface TireListProps {
  tires: Tire[];
  models?: Model[];
  isLoading?: boolean;
}

export function TireList({ tires, models = [], isLoading }: TireListProps) {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/tires/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete tire");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tires"] });
      toast({
        title: "Success",
        description: "Tire deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete tire",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this tire?")) {
      deleteMutation.mutate(id);
    }
  };

  const getModelName = (modelId: number) => {
    const model = models.find(m => m.id === modelId);
    return model ? model.name : `Model ID: ${modelId}`;
  };

  const copyTireDetails = async (tire: Tire) => {
    const modelName = getModelName(tire.modelId);
    const details = `Tire Details:
Model: ${modelName}
Size: ${tire.size}
Price: $${(tire.price / 100).toFixed(2)}
In Stock: ${tire.inStock ? 'Yes' : 'No'}
Season: ${tire.season}
Fuel Efficiency: ${tire.fuelEfficiency}
Wet Grip: ${tire.wetGrip}
Noise Level: ${tire.noiseLevel}dB`;

    try {
      await navigator.clipboard.writeText(details);
      setCopiedId(tire.id);
      toast({
        title: "Success",
        description: "Tire details copied to clipboard",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy tire details",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Model</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-5" /></TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Model</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tires.map((tire) => (
            <TableRow key={tire.id}>
              <TableCell>{getModelName(tire.modelId)}</TableCell>
              <TableCell>{tire.size}</TableCell>
              <TableCell>
                {(tire.price / 100).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </TableCell>
              <TableCell>
                {tire.inStock ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyTireDetails(tire)}
                  >
                    {copiedId === tire.id ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Link href={`/admin/tires/${tire.id}/edit`}>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(tire.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}