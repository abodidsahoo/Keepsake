import React from 'react';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  onFilesSelect: (files: FileList | null) => void;
  disabled: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFilesSelect, disabled }) => {
  return (
    <div className="w-full">
      <label
        htmlFor="file-upload"
        className={`relative block w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#F4C2C2] transition-colors ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
            <UploadIcon className="w-12 h-12 text-gray-400" />
            <span className="font-semibold text-[#33424D]">Click to upload or drag & drop</span>
            <span className="text-sm text-[#33424D]/60">PNG, JPG, WEBP, etc.</span>
        </div>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          multiple
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => onFilesSelect(e.target.files)}
          disabled={disabled}
        />
      </label>
    </div>
  );
};