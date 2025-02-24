import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TireCard } from "./tire-card";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tire } from "@shared/schema";

interface RecommendationCarouselProps {
  recommendations: Tire[];
  isLoading: boolean;
}

export function RecommendationCarousel({ recommendations, isLoading }: RecommendationCarouselProps) {
  if (isLoading) {
    return (
      <div className="w-full py-6">
        <div className="flex gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="w-[300px] h-[400px]">
              <Skeleton className="w-full h-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!recommendations.length) {
    return null;
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {recommendations.map((tire) => (
          <CarouselItem key={tire.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
            <TireCard tire={tire} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
