import React from 'react';

export const ColorwaySelector = ({ colorways, selectedColorway, onSelect }) => {
  if (!colorways || colorways.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-brand-ink">
        <span className="text-brand-muted tracking-wider uppercase font-poppins">اللون:</span>
        <span className="text-brand-olive font-bold">
          {selectedColorway?.name_ar || selectedColorway?.name}
        </span>
      </div>

      <div className="flex items-center gap-3.5">
        {colorways.map((c) => {
          const isSelected = selectedColorway?.id === c.id || (!selectedColorway && c.is_default);
          return (
            <button
              key={c.id || c.name}
              type="button"
              onClick={() => onSelect(c)}
              className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ${
                isSelected
                  ? 'ring-2 ring-brand-sage ring-offset-2 scale-105 shadow-md'
                  : 'hover:scale-105 border border-stone-200'
              }`}
              title={c.name_ar}
            >
              <span
                className="w-9 h-9 rounded-full shadow-inner block"
                style={{ backgroundColor: c.hex_code }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorwaySelector;
