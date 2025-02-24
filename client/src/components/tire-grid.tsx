import { TireCard } from "./tire-card";
import type { Tire } from "@shared/schema";

interface TireGridProps {
  tires: Tire[];
  isLoading: boolean;
}

export function TireGrid({ tires, isLoading }: TireGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-96 bg-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (tires.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">No tires found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tires.map((tire) => (
        <TireCard key={tire.id} tire={tire} />
      ))}
    </div>
  );
}
