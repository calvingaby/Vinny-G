
import { SelectOption } from './types';

export const OUTPUT_STYLES: SelectOption[] = [
  { value: "Photorealistic", label: "Photorealistic" },
  { value: "Cinematic", label: "Cinematic" },
  { value: "Futuristic", label: "Futuristic" },
  { value: "Luxury Commercial", label: "Luxury Commercial" },
  { value: "Editorial Fashion", label: "Editorial Fashion" },
];

export const PERSPECTIVES: SelectOption[] = [
  { value: "Centered Symmetrical", label: "Centered Symmetrical" },
  { value: "Worm's Eye View", label: "Worm's Eye View" },
  { value: "Top-Down View", label: "Top-Down View" },
  { value: "Low Angle", label: "Low Angle" },
  { value: "Eye-Level", label: "Eye-Level" },
  { value: "Shallow Depth of Field (DoF)", label: "Shallow Depth of Field (DoF)" },
];

export const LIGHTING_MOODS: SelectOption[] = [
  { value: "Cinematic Volumetric", label: "Cinematic Volumetric" },
  { value: "Dramatic/Low Key", label: "Dramatic/Low Key" },
  { value: "Studio Softbox", label: "Studio Softbox" },
  { value: "High Key/Clean", label: "High Key/Clean" },
  { value: "Neon/Glow", label: "Neon/Glow" },
];

export const CULTURAL_FOCUSES: SelectOption[] = [
  { value: "African/Black Fashion", label: "African/Black Fashion" },
  { value: "Urban Streetwear", label: "Urban Streetwear" },
  { value: "Futuristic Sci-Fi", label: "Futuristic Sci-Fi" },
  { value: "Cultural", label: "Cultural" },
  { value: "General", label: "General" },
];
