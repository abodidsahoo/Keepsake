import React from 'react';
import type { EffectOption } from '../types';

interface StyleSelectorProps {
  styles: EffectOption[];
  selectedStyle: string | null;
  onSelectStyle: (styleId: string | null) => void;
  disabled: boolean;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ styles, selectedStyle, onSelectStyle, disabled }) => {

  const handleStyleClick = (styleId: string) => {
    // If the clicked style is already selected, deselect it. Otherwise, select it.
    if (selectedStyle === styleId) {
      onSelectStyle(null);
    } else {
      onSelectStyle(styleId);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-[#33424D] mb-2">
        Optional: Choose a Style
      </label>
      <div className="grid grid-cols-3 gap-2">
        {styles.map((style) => {
          const isSelected = selectedStyle === style.id;
          return (
            <button
              key={style.id}
              onClick={() => handleStyleClick(style.id)}
              disabled={disabled}
              className={`
                p-3 border rounded-lg text-center transition-all duration-200
                text-sm font-semibold truncate
                ${isSelected 
                  ? 'bg-[#F4C2C2] border-[#f2b1b1] text-[#33424D] ring-2 ring-[#F4C2C2]/50' 
                  : 'bg-white border-gray-300 text-[#33424D] hover:bg-gray-50 hover:border-gray-400'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              title={style.name}
            >
              {style.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};