import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TireFilters } from "@/components/tire-filters";
import { TireGrid } from "@/components/tire-grid";
import type { TireFilters as TireFiltersType } from "@shared/schema";

export default function Home() {
  const [filters, setFilters] = useState<TireFiltersType>({});

  const { data: tires = [], isLoading } = useQuery({
    queryKey: ["/api/tires", filters],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        <aside>
          <TireFilters filters={filters} onFilterChange={setFilters} />
        </aside>

        <main>
          <h1 className="text-3xl font-bold mb-8">
            Premium Tires for Every Vehicle
          </h1>
          <TireGrid tires={tires} isLoading={isLoading} />
        </main>
      </div>
    </div>
  );
}