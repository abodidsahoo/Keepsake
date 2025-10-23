export interface ProcessedImage {
  id: string;
  file: File;
  originalUrl: string;
  restoredUrl: string | null;
  status: 'pending' | 'processing' | 'done' | 'error';
  error?: string;

  // New properties for post-restoration stylization
  stylizeStatus: 'idle' | 'processing' | 'done' | 'error';
  stylizedUrl: string | null;
  stylizeError?: string;
  selectedStyleId: string | null;
  customStylizePrompt: string;
}

export type EffectOption = {
  id: string;
  name: string;
  prompt: string;
};