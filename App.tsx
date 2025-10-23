import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageResultGrid } from './components/ImageResultGrid';
import { restoreImage } from './services/geminiService';
import type { ProcessedImage } from './types';
import { fileToBase64 } from './utils/fileUtils';
import { STYLES } from './effects';

const App: React.FC = () => {
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFilesSelect = (files: FileList | null) => {
    if (files) {
      const newImages: ProcessedImage[] = Array.from(files).map(file => ({
        id: `${file.name}-${Date.now()}`,
        file,
        originalUrl: URL.createObjectURL(file),
        restoredUrl: null,
        status: 'pending',
        stylizeStatus: 'idle',
        stylizedUrl: null,
        selectedStyleId: null,
        customStylizePrompt: '',
      }));
      setProcessedImages(prev => [...prev, ...newImages]);
    }
  };
  
  const handleRestore = useCallback(async () => {
    if (isProcessing || processedImages.every(img => img.status !== 'pending')) return;

    setIsProcessing(true);
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API key is not set. Please set the API_KEY environment variable.");
      setProcessedImages(prev => prev.map(img => img.status === 'pending' ? { ...img, status: 'error', error: 'API Key not configured.' } : img));
      setIsProcessing(false);
      return;
    }
    const ai = new GoogleGenAI({ apiKey });

    const restorationPromises = processedImages
      .filter(image => image.status === 'pending')
      .map(async (image) => {
        setProcessedImages(prev => prev.map(img => img.id === image.id ? { ...img, status: 'processing' } : img));
        try {
          const base64Data = await fileToBase64(image.file);
          // Pass an empty string for the additional prompt for a pure restoration
          const restoredUrl = await restoreImage(ai, base64Data, image.file.type, '');
          setProcessedImages(prev => prev.map(img => img.id === image.id ? { ...img, status: 'done', restoredUrl } : img));
        } catch (error) {
          console.error(`Failed to restore ${image.file.name}:`, error);
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
          setProcessedImages(prev => prev.map(img => img.id === image.id ? { ...img, status: 'error', error: errorMessage } : img));
        }
      });
      
    await Promise.all(restorationPromises);
    setIsProcessing(false);
  }, [processedImages, isProcessing]);
  
  const handleStylize = useCallback(async (imageId: string) => {
    const imageToStylize = processedImages.find(img => img.id === imageId);
    if (!imageToStylize || !imageToStylize.restoredUrl || imageToStylize.stylizeStatus === 'processing') return;

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API key not configured.");
        setProcessedImages(prev => prev.map(img => img.id === imageId ? { ...img, stylizeStatus: 'error', stylizeError: 'API Key not configured.' } : img));
        return;
    }
    const ai = new GoogleGenAI({ apiKey });

    setProcessedImages(prev => prev.map(img => img.id === imageId ? { ...img, stylizeStatus: 'processing' } : img));
    
    let additionalPrompt = "Using the provided restored image as a base, apply the following creative edits.";
    const style = STYLES.find(s => s.id === imageToStylize.selectedStyleId);
    if (style) {
      additionalPrompt += `\n\nStyle instructions: ${style.prompt}`;
    }
    if (imageToStylize.customStylizePrompt) {
      additionalPrompt += `\n\nAdditional user instructions: "${imageToStylize.customStylizePrompt}".`;
    }

    try {
        const restoredUrl = imageToStylize.restoredUrl;
        const [meta, base64Data] = restoredUrl.split(',');
        if (!base64Data) throw new Error("Could not extract Base64 data from restored image.");
        const mimeType = meta.match(/:(.*?);/)?.[1] || 'image/png';

        const stylizedUrl = await restoreImage(ai, base64Data, mimeType, additionalPrompt);
        setProcessedImages(prev => prev.map(img => img.id === imageId ? { ...img, stylizeStatus: 'done', stylizedUrl } : img));
    } catch (error) {
        console.error(`Failed to stylize ${imageToStylize.file.name}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        setProcessedImages(prev => prev.map(img => img.id === imageId ? { ...img, stylizeStatus: 'error', stylizeError: errorMessage } : img));
    }
  }, [processedImages]);

  const handleImageStateChange = (id: string, field: keyof ProcessedImage, value: any) => {
    setProcessedImages(prev => prev.map(img => img.id === id ? { ...img, [field]: value } : img));
  };

  const handleDownloadAll = () => {
    processedImages.forEach((image, index) => {
      if (image.restoredUrl && image.status === 'done') {
        setTimeout(() => {
          const a = document.createElement('a');
          a.href = image.stylizedUrl || image.restoredUrl;
          a.download = `${image.stylizedUrl ? 'stylized' : 'restored'}_${image.file.name}`;
          document.body.appendChild(a);
a.click();
          document.body.removeChild(a);
        }, index * 300); 
      }
    });
  };

  const clearAll = () => {
    processedImages.forEach(img => URL.revokeObjectURL(img.originalUrl));
    setProcessedImages([]);
  };

  const hasPendingImages = processedImages.some(img => img.status === 'pending');
  const hasCompletedImages = processedImages.some(img => img.status === 'done');

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-white/60 rounded-2xl shadow-2xl p-6 md:p-8 backdrop-blur-sm border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Controls Column */}
            <div className="lg:col-span-4 space-y-6">
              <ImageUploader onFilesSelect={handleFilesSelect} disabled={isProcessing} />
              
              <div className="space-y-3 pt-4">
                <button
                  onClick={handleRestore}
                  disabled={!hasPendingImages || isProcessing}
                  className="w-full bg-[#F4C2C2] hover:bg-[#f2b1b1] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-[#33424D] font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center text-lg"
                >
                  {isProcessing ? 'Processing...' : 'Restore Images'}
                </button>
                <p className="text-xs text-center text-[#33424D]/60 pt-1">You will get options to stylize the photographs after the restoration.</p>
                 <div className="flex space-x-3 pt-2">
                    {hasCompletedImages && (
                        <button
                        onClick={handleDownloadAll}
                        disabled={isProcessing}
                        className="flex-1 bg-[#D9F0E3] hover:bg-[#c8e8d7] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-[#33424D] font-bold py-2 px-4 rounded-lg transition-all duration-300"
                        >
                        Download All
                        </button>
                    )}
                    {processedImages.length > 0 && (
                         <button
                         onClick={clearAll}
                         disabled={isProcessing}
                         className="flex-1 bg-transparent hover:bg-[#F4C2C2]/20 border border-[#F4C2C2] text-[#F4C2C2] disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:bg-transparent font-bold py-2 px-4 rounded-lg transition-all duration-300"
                       >
                         Clear All
                       </button>
                    )}
                 </div>
              </div>
            </div>
            
            {/* Results Column */}
            <div className="lg:col-span-8">
                <ImageResultGrid 
                    images={processedImages} 
                    styles={STYLES}
                    onStylize={handleStylize}
                    onImageStateChange={handleImageStateChange}
                />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;