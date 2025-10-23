import type { EffectOption } from './types';

export const STYLES: EffectOption[] = [
  {
    id: 'polaroid',
    name: 'Polaroid',
    prompt: 'Restyle the image to look like a classic Polaroid photograph. It should have characteristic faded colors, soft focus, and be framed within a white Polaroid border with the typical aspect ratio. The bottom border should be thicker.'
  },
  {
    id: 'studio',
    name: 'Studio Retouch',
    prompt: 'Retouch the image to look like a professional fashion studio portrait. Apply high-key lighting, smooth the skin while retaining texture, sharpen key details like eyes and hair, and enhance the colors to be vibrant and clean.'
  },
  {
    id: 'modern',
    name: 'Modern Look',
    prompt: "Update the photograph's aesthetic to look like it was taken in the 2020s with a high-end mirrorless camera. Introduce a contemporary color grade with slightly muted highlights and lifted shadows. Ensure the image is crisp and detailed."
  }
];