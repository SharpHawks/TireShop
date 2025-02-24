export type FilterValue = {
  label: string;
  value: string;
  description?: string;
};

export const TIRE_WIDTHS = [
  { label: "205", value: "205" },
  { label: "215", value: "215" },
  { label: "225", value: "225" },
  { label: "235", value: "235" },
  { label: "245", value: "245" },
  { label: "255", value: "255" },
];

export const TIRE_ASPECTS = [
  { label: "45", value: "45" },
  { label: "50", value: "50" },
  { label: "55", value: "55" },
  { label: "60", value: "60" },
  { label: "65", value: "65" },
];

export const TIRE_DIAMETERS = [
  { label: "16", value: "16" },
  { label: "17", value: "17" },
  { label: "18", value: "18" },
  { label: "19", value: "19" },
  { label: "20", value: "20" },
];

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