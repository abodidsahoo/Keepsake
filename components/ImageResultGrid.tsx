import React from 'react';
import type { ProcessedImage, EffectOption } from '../types';
import { ImageComparisonCard } from './ImageComparisonCard';

interface ImageResultGridProps {
    images: ProcessedImage[];
    styles: EffectOption[];
    onStylize: (imageId: string) => void;
    onImageStateChange: (id: string, field: keyof ProcessedImage, value: any) => void;
}

export const ImageResultGrid: React.FC<ImageResultGridProps> = ({ images, styles, onStylize, onImageStateChange }) => {
    if (images.length === 0) {
        return (
            <div className="flex items-center justify-center h-full min-h-[300px] bg-gray-50/50 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                    <p className="text-[#33424D]/80 text-lg">Your restored photos will appear here.</p>
                    <p className="text-[#33424D]/60">Upload some images to get started!</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {images.map(image => (
                <ImageComparisonCard 
                    key={image.id} 
                    image={image}
                    styles={styles}
                    onStylize={onStylize}
                    onImageStateChange={onImageStateChange}
                />
            ))}
        </div>
    );
};