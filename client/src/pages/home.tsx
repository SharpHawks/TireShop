import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { TireFilters } from "@/components/tire-filters";
import { TireGrid } from "@/components/tire-grid";
import { PreferencesForm } from "@/components/preferences-form";
import { RecommendationCarousel } from "@/components/recommendation-carousel";
import type { TireFilters as TireFiltersType, Tire } from "@shared/schema";
import type { UserPreferences } from "@shared/types";
import { apiRequest } from "@/lib/queryClient";

export default function Home() {
  const [filters, setFilters] = useState<TireFiltersType>({});
  const [showRecommendations, setShowRecommendations] = useState(false);

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

  const { mutate: getRecommendations, data: recommendations, isPending } = useMutation({
    mutationFn: async (preferences: UserPreferences) => {
      const response = await apiRequest("/api/recommendations", {
        method: "POST",
        body: JSON.stringify(preferences),
      });
      return response.json();
    },
  });

  const handlePreferencesSubmit = (preferences: UserPreferences) => {
    setShowRecommendations(true);
    getRecommendations(preferences);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        <aside className="space-y-8">
          <PreferencesForm onSubmit={handlePreferencesSubmit} />
          <TireFilters filters={filters} onFilterChange={setFilters} />
        </aside>

        <main className="space-y-8">
          {showRecommendations && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Recommended for You
              </h2>
              <RecommendationCarousel
                recommendations={recommendations || []}
                isLoading={isPending}
              />
            </section>
          )}

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              All Available Tires
            </h2>
            <TireGrid tires={tires} isLoading={isLoading} />
          </section>
        </main>
      </div>
    </div>
  );
}