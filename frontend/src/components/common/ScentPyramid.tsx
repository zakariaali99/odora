import React from 'react';
import { useTranslation } from 'react-i18next';
import { Wind, Heart, Mountain } from 'lucide-react';
import { ScentNotes } from '../../types';

interface ScentPyramidProps {
  notes?: ScentNotes & { scent_family?: string; scent_family_ar?: string };
  pyramid?: {
    topAr?: string;
    topEn?: string;
    heartAr?: string;
    heartEn?: string;
    baseAr?: string;
    baseEn?: string;
  };
}

export const ScentPyramid: React.FC<ScentPyramidProps> = ({ notes, pyramid }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const effectiveNotes = notes || (pyramid ? {
    top_notes: pyramid.topEn,
    top_notes_ar: pyramid.topAr,
    heart_notes: pyramid.heartEn,
    heart_notes_ar: pyramid.heartAr,
    base_notes: pyramid.baseEn,
    base_notes_ar: pyramid.baseAr,
  } : undefined);

  if (!effectiveNotes) return null;

  return (
    <div className="odora-card p-6 border border-stone-200/80 bg-white">
      <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
        <h4 className="text-xs tracking-[0.16em] uppercase text-brand-muted font-poppins font-semibold">
          {t('common.scentPyramid')}
        </h4>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-pale text-brand-olive font-medium">
          {isRtl ? (notes?.scent_family_ar || notes?.scent_family || '') : (notes?.scent_family || notes?.scent_family_ar || '')}
        </span>
      </div>

      <div className="space-y-4">
        {/* Top Notes */}
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
            <Wind className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-brand-ink">
                {t('common.topNotes')} {isRtl ? '(Top Notes)' : ''}
              </span>
              <span className="text-[11px] text-brand-muted">
                {isRtl ? 'أول 15 دقيقة' : 'First 15 mins'}
              </span>
            </div>
            <p className="text-sm font-medium text-brand-olive mt-0.5">
              {isRtl ? (effectiveNotes.top_notes_ar || effectiveNotes.top_notes) : (effectiveNotes.top_notes || effectiveNotes.top_notes_ar)}
            </p>
          </div>
        </div>

        <div className="border-t border-stone-100/80" />

        {/* Heart Notes */}
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
            <Heart className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-brand-ink">
                {t('common.heartNotes')} {isRtl ? '(Heart Notes)' : ''}
              </span>
              <span className="text-[11px] text-brand-muted">
                {isRtl ? 'الشخصية المركزية' : 'Core character'}
              </span>
            </div>
            <p className="text-sm font-medium text-brand-olive mt-0.5">
              {isRtl ? (effectiveNotes.heart_notes_ar || effectiveNotes.heart_notes) : (effectiveNotes.heart_notes || effectiveNotes.heart_notes_ar)}
            </p>
          </div>
        </div>

        <div className="border-t border-stone-100/80" />

        {/* Base Notes */}
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 mt-0.5">
            <Mountain className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-brand-ink">
                {t('common.baseNotes')} {isRtl ? '(Base Notes)' : ''}
              </span>
              <span className="text-[11px] text-brand-muted">
                {isRtl ? 'الاستقرار والعمق' : 'Depth & longevity'}
              </span>
            </div>
            <p className="text-sm font-medium text-brand-olive mt-0.5">
              {isRtl ? (effectiveNotes.base_notes_ar || effectiveNotes.base_notes) : (effectiveNotes.base_notes || effectiveNotes.base_notes_ar)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScentPyramid;
