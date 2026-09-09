import React from 'react';
import { useTranslation } from 'react-i18next';
import { Colorway } from '../../types';

interface ColorwaySelectorProps {
  colorways?: Colorway[];
  selectedColorway?: Colorway | null;
  onSelect: (colorway: Colorway) => void;
}

export const ColorwaySelector: React.FC<ColorwaySelectorProps> = ({
  colorways,
  selectedColorway,
  onSelect,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  if (!colorways || colorways.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-brand-ink">
        <span className="text-brand-muted tracking-wider uppercase font-poppins">
          {t('product.color')}:
        </span>
        <span className="text-brand-olive font-bold">
          {isRtl ? (selectedColorway?.name_ar || selectedColorway?.name) : (selectedColorway?.name || selectedColorway?.name_ar)}
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
              title={isRtl ? c.name_ar : c.name}
              aria-label={isRtl ? c.name_ar : c.name}
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
