export type FilterValue = {
  label: string;
  value: string;
  description?: string;
};

export const TIRE_CODES: FilterValue[] = [
  { label: "RSC", value: "RSC", description: "Run Flat System Component - Can continue driving after a puncture" },
  { label: "SEAL", value: "SEAL", description: "Self-sealing technology for puncture protection" },
  { label: "SOUND", value: "SOUND", description: "Enhanced noise reduction technology" },
  { label: "XL", value: "XL", description: "Extra Load - Higher load capacity" },
  { label: "ELECT", value: "ELECT", description: "Specifically designed for electric vehicles" },
  { label: "MFS", value: "MFS", description: "Max Flange Shield - Rim protection" },
  { label: "N0", value: "N0", description: "Original equipment for Porsche vehicles" },
  { label: "*", value: "STAR", description: "Original equipment for BMW vehicles" },
];

export const EFFICIENCY_RATINGS: FilterValue[] = [
  { label: "A", value: "A" },
  { label: "B", value: "B" },
  { label: "C", value: "C" },
  { label: "D", value: "D" },
  { label: "E", value: "E" },
  { label: "F", value: "F" },
  { label: "G", value: "G" },
];

export const NOISE_RATINGS: FilterValue[] = [
  { label: "A", value: "A" },
  { label: "B", value: "B" },
  { label: "C", value: "C" },
];