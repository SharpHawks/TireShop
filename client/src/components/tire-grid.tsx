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
            className="h-96 bg-gradient-to-br from-slate-100 to-blue-50 animate-pulse rounded-xl shadow-lg"
          />
        ))}
      </div>
    );
  }

  if (tires.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-slate-800 mb-2">No tires found</h3>
        <p className="text-slate-600">
          Try adjusting your filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tires.map((tire) => (
        <div key={tire.id} className="transform transition-all duration-300 hover:scale-[1.02]">
          <TireCard tire={tire} />
        </div>
      ))}
    </div>
  );
}