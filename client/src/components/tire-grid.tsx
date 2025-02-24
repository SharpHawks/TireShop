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
            className="h-[400px] bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (tires.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No tires found</h3>
        <p className="text-gray-600">
          Try adjusting your filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tires.map((tire) => (
        <div key={tire.id} className="transition-transform duration-200 hover:-translate-y-1">
          <TireCard tire={tire} />
        </div>
      ))}
    </div>
  );
}