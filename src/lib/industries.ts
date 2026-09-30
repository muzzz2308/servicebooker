export const INDUSTRIES = [
  { value: "hair-beauty", label: "Hair & beauty" },
  { value: "nails-spa", label: "Nails & spa" },
  { value: "wellness", label: "Wellness" },
  { value: "fitness-coaching", label: "Fitness & coaching" },
  { value: "home-services", label: "Home services" },
  { value: "auto", label: "Auto & mobile" },
  { value: "pets", label: "Pets" },
  { value: "professional", label: "Professional services" },
  { value: "other", label: "Other" },
] as const;

export type IndustryValue = (typeof INDUSTRIES)[number]["value"];

export function isIndustry(value: string): value is IndustryValue {
  return INDUSTRIES.some((item) => item.value === value);
}
