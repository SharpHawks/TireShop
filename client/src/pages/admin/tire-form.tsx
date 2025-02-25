import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { insertTireSchema, type InsertTire, type Tire, type Model } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

export default function TireForm() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { id, modelId } = useParams<{ id?: string; modelId?: string }>();
  const isEditing = !!id;

  const { data: tire, isLoading: tireLoading } = useQuery<Tire>({
    queryKey: [`/api/tires/${id}`],
    enabled: isEditing,
  });

  const { data: models = [], isLoading: modelsLoading } = useQuery<Model[]>({
    queryKey: ["/api/models"],
  });

  // Initialize form with default values
  const defaultValues: InsertTire = {
    modelId: modelId ? parseInt(modelId) : 1, // Set to first model as default
    inStock: true,
    fuelEfficiency: 'A',
    wetGrip: 'A',
    noiseLevel: 70,
    price: '0', // Price as string
    size: '',
    code: '',
    imageUrl: '',
  };

  const form = useForm<InsertTire>({
    resolver: zodResolver(insertTireSchema),
    defaultValues: isEditing && tire ? {
      ...tire,
      price: (tire.price / 100).toString(), // Convert cents to dollars for display
      modelId: tire.modelId,
    } : defaultValues,
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertTire) => {
      const formattedData = {
        ...data,
        modelId: modelId ? parseInt(modelId) : data.modelId,
        // Convert the price from dollars to cents when sending to server
        price: (parseFloat(data.price) * 100).toFixed(0),
      };

      const response = await fetch(
        isEditing ? `/api/tires/${id}` : '/api/tires',
        {
          method: isEditing ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedData),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to save tire: ${error}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tires'] });
      toast({
        title: 'Success',
        description: `Tire ${isEditing ? 'updated' : 'created'} successfully`,
      });
      navigate('/admin');
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: InsertTire) => {
    mutation.mutate(data);
  };

  if ((isEditing && tireLoading) || modelsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {isEditing ? 'Edit' : 'Add New'} Tire
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="modelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.id} value={model.id.toString()}>
                          {model.name} ({model.season === 1 ? 'Summer' : 'Winter'})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="205/55R16" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="MFS" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" placeholder="https://example.com/tire-image.jpg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (in dollars)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      step="0.01"
                      onChange={(e) => field.onChange(e.target.value)} // Keep as string
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="noiseLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Noise Level (dB)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      max="120"
                      step="1"
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fuelEfficiency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuel Efficiency Rating</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((rating) => (
                        <SelectItem key={rating} value={rating}>
                          {rating}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="wetGrip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wet Grip Rating</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((rating) => (
                        <SelectItem key={rating} value={rating}>
                          {rating}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="inStock"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="!mt-0">In Stock</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save Tire'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}