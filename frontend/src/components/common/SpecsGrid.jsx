import React from 'react';
import { Maximize2, Droplets, VolumeX, Zap } from 'lucide-react';

export const SpecsGrid = ({ specs }) => {
  const items = [
    {
      icon: Maximize2,
      label: 'مساحة التغطية',
      value: specs?.coverage_area || '900 m²',
      sub: 'تغطية متجانسة للصالات الكبيرة',
    },
    {
      icon: Droplets,
      label: 'سعة خزان الزيت',
      value: specs?.capacity || '1000 ml',
      sub: 'تكفي حتى 90 يوماً من الاستخدام',
    },
    {
      icon: VolumeX,
      label: 'مستوى الضجيج',
      value: specs?.noise_level || '< 25 dB',
      sub: 'فائق الهدوء (همس غير مسموع)',
    },
    {
      icon: Zap,
      label: 'الجهد الكهربائي',
      value: specs?.power_spec || '12V / 2A',
      sub: 'كفاءة طاقة عالية واستهلاك اقتصادي',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="odora-card p-6 border border-stone-200/80 bg-white flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-full bg-brand-pale/60 text-brand-olive flex items-center justify-center mb-4">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-ink font-poppins">{item.value}</div>
              <div className="text-xs font-semibold text-brand-olive mt-1">{item.label}</div>
              <div className="text-[11px] text-brand-muted mt-0.5">{item.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SpecsGrid;
