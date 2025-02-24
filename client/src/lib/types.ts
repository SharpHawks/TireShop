export type FilterValue = {
  label: string;
  value: string;
};

export const TIRE_CODES: FilterValue[] = [
  { label: "MFS (Max Flange Shield)", value: "MFS" },
  { label: "RSC (Run Flat)", value: "RSC" },
  { label: "XL (Extra Load)", value: "XL" },
];

export const EFFICIENCY_RATINGS: FilterValue[] = [
  { label: "A", value: "A" },
  { label: "B", value: "B" },
  { label: "C", value: "C" },
];