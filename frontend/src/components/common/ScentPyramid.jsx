import React from 'react';
import { Wind, Heart, Mountain } from 'lucide-react';

export const ScentPyramid = ({ notes }) => {
  if (!notes) return null;

  return (
    <div className="odora-card p-6 border border-stone-200/80 bg-white">
      <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
        <h4 className="text-xs tracking-[0.16em] uppercase text-brand-muted font-poppins font-semibold">
          SCENT PROFILE · الهرم العطري
        </h4>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-pale text-brand-olive font-medium">
          {notes.scent_family_ar || notes.scent_family}
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
              <span className="text-xs font-bold text-brand-ink">قمة العطر (Top Notes)</span>
              <span className="text-[11px] text-brand-muted">أول 15 دقيقة</span>
            </div>
            <p className="text-sm font-medium text-brand-olive mt-0.5">
              {notes.top_notes_ar || notes.top_notes}
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
              <span className="text-xs font-bold text-brand-ink">قلب العطر (Heart Notes)</span>
              <span className="text-[11px] text-brand-muted">الشخصية المركزية</span>
            </div>
            <p className="text-sm font-medium text-brand-olive mt-0.5">
              {notes.heart_notes_ar || notes.heart_notes}
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
              <span className="text-xs font-bold text-brand-ink">قاعدة العطر (Base Notes)</span>
              <span className="text-[11px] text-brand-muted">الاستقرار والعمق</span>
            </div>
            <p className="text-sm font-medium text-brand-olive mt-0.5">
              {notes.base_notes_ar || notes.base_notes}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScentPyramid;
