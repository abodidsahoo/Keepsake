import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center p-8 border-b border-[#33424D]/10">
      <h1 className="text-6xl md:text-7xl font-lora font-medium tracking-tight text-[#33424D]">
        Keepsake
      </h1>
      <p className="mt-2 text-lg text-[#33424D]/80">
        Breathe new life into your old memories.
      </p>
    </header>
  );
};