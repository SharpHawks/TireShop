import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TireFilters } from "@/components/tire-filters";
import { TireGrid } from "@/components/tire-grid";
import type { TireFilters as TireFiltersType, Tire } from "@shared/schema";

export default function Home() {
  const [filters, setFilters] = useState<TireFiltersType>({});

  // Create the query string from filters
  const getQueryString = (filters: TireFiltersType) => {
    const params = new URLSearchParams();

    // Only add defined filters to query string
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    return params.toString();
  };

  const { data: tires = [], isLoading } = useQuery<Tire[]>({
    queryKey: ["/api/tires", filters],
    queryFn: async () => {
      const queryString = getQueryString(filters);
      const response = await fetch(`/api/tires?${queryString}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
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