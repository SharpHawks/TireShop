import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import type { Tire } from "@shared/schema";
import { Link } from "wouter";

interface TireCardProps {
  tire: Tire;
}

export function TireCard({ tire }: TireCardProps) {
  return (
    <Card className="overflow-hidden">
      <img
        src={tire.imageUrl}
        alt={tire.name}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{tire.brand} {tire.name}</h3>
          <p className="text-sm text-muted-foreground">{tire.size}</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline">{tire.code}</Badge>
          <Badge variant="outline">Fuel: {tire.fuelEfficiency}</Badge>
          <Badge variant="outline">Wet: {tire.wetGrip}</Badge>
          <Badge variant="outline">{tire.noiseLevel}dB</Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">
            ${(tire.price / 100).toFixed(2)}
          </span>
          <Button size="sm">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
