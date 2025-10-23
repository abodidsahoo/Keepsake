import React from 'react';
import type { ProcessedImage, EffectOption } from '../types';
import { Spinner } from './Spinner';
import { DownloadIcon, ErrorIcon } from './Icons';
import { StyleSelector } from './StyleSelector';

interface ImageComparisonCardProps {
    image: ProcessedImage;
    styles: EffectOption[];
    onStylize: (imageId: string) => void;
    onImageStateChange: (id: string, field: keyof ProcessedImage, value: any) => void;
}

export const ImageComparisonCard: React.FC<ImageComparisonCardProps> = ({ image, styles, onStylize, onImageStateChange }) => {
  const handleDownload = (type: 'restored' | 'stylized') => {
    const url = type === 'restored' ? image.restoredUrl : image.stylizedUrl;
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_${image.file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const isStylizing = image.stylizeStatus === 'processing';
    
  return (
    <div className="bg-white/80 p-4 rounded-xl border border-gray-200 shadow-lg transition-all duration-300">
        <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-[#33424D]/70 truncate pr-4" title={image.file.name}>{image.file.name}</p>
            {image.status === 'done' && (
                <button 
                    onClick={() => handleDownload('restored')}
                    className="flex items-center space-x-2 bg-[#D9F0E3] hover:bg-[#c8e8d7] text-[#33424D] text-xs font-bold py-1 px-3 rounded-full transition-colors"
                >
                    <DownloadIcon className="w-4 h-4" />
                    <span>Restored</span>
                </button>
            )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h3 className="text-center text-sm font-semibold text-[#33424D] mb-2">Original</h3>
                <img src={image.originalUrl} alt="Original" className="w-full h-auto object-contain rounded-lg aspect-square bg-gray-100"/>
            </div>
            <div>
                <h3 className="text-center text-sm font-semibold text-[#33424D] mb-2">Restored</h3>
                <div className="w-full h-auto object-contain rounded-lg aspect-square bg-gray-100 flex items-center justify-center">
                    {image.status === 'processing' && <Spinner />}
                    {image.status === 'done' && image.restoredUrl && (
                        <img src={image.restoredUrl} alt="Restored" className="w-full h-full object-contain rounded-lg"/>
                    )}
                    {image.status === 'error' && (
                        <div className="text-center text-red-500 p-4">
                            <ErrorIcon className="w-10 h-10 mx-auto mb-2" />
                            <p className="font-semibold">Restoration Failed</p>
                            <p className="text-xs text-[#33424D]/60 mt-1">{image.error}</p>
                        </div>
                    )}
                     {(image.status === 'pending') && (
                        <div className="text-center text-[#33424D]/70">
                            <p>Pending...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* --- Stylization Section --- */}
        {image.status === 'done' && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-md font-bold text-center text-[#F4C2C2] mb-4">
              Want to take it a step further?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="space-y-3">
                    <StyleSelector 
                        styles={styles}
                        selectedStyle={image.selectedStyleId}
                        onSelectStyle={(styleId) => onImageStateChange(image.id, 'selectedStyleId', styleId)}
                        disabled={isStylizing}
                    />
                    <textarea
                        rows={2}
                        className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm text-[#33424D] placeholder-gray-400 focus:ring-2 focus:ring-[#F4C2C2] focus:border-[#F4C2C2] transition"
                        placeholder="Add more custom edits..."
                        value={image.customStylizePrompt}
                        onChange={(e) => onImageStateChange(image.id, 'customStylizePrompt', e.target.value)}
                        disabled={isStylizing}
                    />
                     <button
                        onClick={() => onStylize(image.id)}
                        disabled={isStylizing}
                        className="w-full bg-[#F4C2C2] hover:bg-[#f2b1b1] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-[#33424D] font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                        >
                        {isStylizing ? 'Applying Style...' : 'Stylize'}
                    </button>
                </div>
                <div>
                  <div className="w-full h-auto object-contain rounded-lg aspect-square bg-gray-100 flex items-center justify-center relative">
                    {image.stylizeStatus === 'processing' && <Spinner />}
                    {image.stylizeStatus === 'done' && image.stylizedUrl && (
                        <>
                            <img src={image.stylizedUrl} alt="Stylized" className="w-full h-full object-contain rounded-lg"/>
                            <button 
                                onClick={() => handleDownload('stylized')}
                                className="absolute top-2 right-2 flex items-center space-x-2 bg-[#D9F0E3] hover:bg-[#c8e8d7] text-[#33424D] text-xs font-bold py-1 px-3 rounded-full transition-colors z-10"
                            >
                                <DownloadIcon className="w-4 h-4" />
                            </button>
                        </>
                    )}
                    {image.stylizeStatus === 'error' && (
                        <div className="text-center text-red-500 p-4">
                            <ErrorIcon className="w-8 h-8 mx-auto mb-1" />
                            <p className="font-semibold text-sm">Styling Failed</p>
                            <p className="text-xs text-[#33424D]/60 mt-1">{image.stylizeError}</p>
                        </div>
                    )}
                    {image.stylizeStatus === 'idle' && (
                        <div className="text-center text-[#33424D]/70 p-4">
                            <p>Your stylized image will appear here.</p>
                        </div>
                    )}
                  </div>
                </div>
            </div>
          </div>
        )}
    </div>
  );
};