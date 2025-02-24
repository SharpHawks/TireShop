import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pencil,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Tire } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

export default function AdminPage() {
  const { toast } = useToast();
  const { data: tires = [], isLoading } = useQuery<Tire[]>({
    queryKey: ["/api/tires"],
  });

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tire Management</h1>
        <Link href="/admin/tires/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Tire
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tires.map((tire) => (
              <TableRow key={tire.id}>
                <TableCell>{tire.id}</TableCell>
                <TableCell>{tire.brand}</TableCell>
                <TableCell>{tire.name}</TableCell>
                <TableCell>{tire.size}</TableCell>
                <TableCell>${(tire.price / 100).toFixed(2)}</TableCell>
                <TableCell>
                  {tire.inStock ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
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
    </div>
  );
}
