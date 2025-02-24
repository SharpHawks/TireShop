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
        // Convert boolean to string 'true' or 'false'
        if (typeof value === 'boolean') {
          params.append(key, value ? 'true' : 'false');
        } else {
          params.append(key, value.toString());
        }
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
    <div className="min-h-screen bg-[#f8f9fa] bg-[radial-gradient(#e9ecef_1px,transparent_1px)] [background-size:20px_20px]">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Tires
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our extensive collection of premium tires, expertly curated for every vehicle and driving style.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          <aside>
            <div className="sticky top-6">
              <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden [background-image:repeating-linear-gradient(45deg,#fcfcfc_25%,transparent_25%,transparent_75%,#fcfcfc_75%,#fcfcfc),repeating-linear-gradient(45deg,#fcfcfc_25%,#ffffff_25%,#ffffff_75%,#fcfcfc_75%,#fcfcfc)] [background-position:0_0,10px_10px] [background-size:20px_20px]">
                <TireFilters filters={filters} onFilterChange={setFilters} />
              </div>
            </div>
          </aside>

          <main>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <TireGrid tires={tires} isLoading={isLoading} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}