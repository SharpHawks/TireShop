import { TireCard } from "./tire-card";
import type { Tire } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface TireGridProps {
  tires: Tire[];
  isLoading: boolean;
}

export function TireGrid({ tires, isLoading }: TireGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="group">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 space-y-4">
              <div className="aspect-square relative overflow-hidden rounded-md">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-9 w-[120px]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tires.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50/50 rounded-lg border border-gray-200">
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
        <div 
          key={tire.id} 
          className="group transition-all duration-300 hover:-translate-y-1"
        >
          <div className="bg-white rounded-lg shadow-lg transition-shadow duration-300 group-hover:shadow-xl border border-gray-200 bg-[linear-gradient(rgba(255,255,255,.9),rgba(255,255,255,.9)),repeating-linear-gradient(45deg,#f8f9fa_0px,#f8f9fa_1px,transparent_1px,transparent_10px)]">
            <TireCard tire={tire} />
          </div>
        </div>
      ))}
    </div>
  );
}