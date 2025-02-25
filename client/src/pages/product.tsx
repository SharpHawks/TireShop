import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Fuel,
  Waves,
  Volume2,
  Calendar,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import type { Tire } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

function PerformanceIndicator({
  label,
  rating,
  icon: Icon,
}: {
  label: string;
  rating: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center gap-3 p-4 bg-accent/50 rounded-lg">
      <Icon className="h-8 w-8 text-primary" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-semibold">{rating}</p>
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <Skeleton className="aspect-square rounded-lg" />
        <div className="space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const { data: tire, isLoading } = useQuery<Tire>({
    queryKey: [`/api/tires/${id}`],
  });

  if (isLoading || !tire) {
    return <ProductSkeleton />;
  }

  // Format price from cents to dollars with proper decimal places
  const formattedPrice = (tire.price / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/">
        <div className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
          Back to Tires
        </div>
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <img
              src={tire.imageUrl}
              alt={`Tire ${tire.size}`}
              className="w-full aspect-square object-cover rounded-lg"
            />
          </CardContent>
        </Card>

        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {tire.code} - {tire.size}
            </h1>
          </div>

          <div className="grid gap-4">
            <PerformanceIndicator
              label="Fuel Efficiency"
              rating={tire.fuelEfficiency}
              icon={Fuel}
            />
            <PerformanceIndicator
              label="Wet Grip"
              rating={tire.wetGrip}
              icon={Waves}
            />
            <PerformanceIndicator
              label="Noise Level"
              rating={`${tire.noiseLevel} dB`}
              icon={Volume2}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-sm">
              {tire.code}
            </Badge>
            {tire.inStock ? (
              <Badge variant="secondary" className="text-sm">
                <CheckCircle className="h-4 w-4 mr-1" />
                In Stock
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-sm">
                <XCircle className="h-4 w-4 mr-1" />
                Out of Stock
              </Badge>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold">
                {formattedPrice}
              </span>
              <span className="text-sm text-muted-foreground">
                Price per tire
              </span>
            </div>

            <Button className="w-full" size="lg" disabled={!tire.inStock}>
              <ShoppingCart className="h-5 w-5 mr-2" />
              {tire.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}