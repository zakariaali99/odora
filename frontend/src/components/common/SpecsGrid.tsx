import React from 'react';
import { useTranslation } from 'react-i18next';
import { Maximize2, Droplets, VolumeX, Zap } from 'lucide-react';

interface SpecsGridProps {
  specs?: any;
}

export const SpecsGrid: React.FC<SpecsGridProps> = ({ specs }) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const items = [
    {
      icon: Maximize2,
      label: isRtl ? 'مساحة التغطية' : 'Coverage Area',
      value: specs?.coverage_area || '900 m²',
      sub: isRtl ? 'تغطية متجانسة للصالات الكبيرة' : 'Even coverage for large spaces',
    },
    {
      icon: Droplets,
      label: isRtl ? 'سعة خزان الزيت' : 'Oil Reservoir Capacity',
      value: specs?.capacity || '1000 ml',
      sub: isRtl ? 'تكفي حتى 90 يوماً من الاستخدام' : 'Lasts up to 90 days of operation',
    },
    {
      icon: VolumeX,
      label: isRtl ? 'مستوى الضجيج' : 'Noise Level',
      value: specs?.noise_level || '< 25 dB',
      sub: isRtl ? 'فائق الهدوء (همس غير مسموع)' : 'Whisper-quiet acoustic profile',
    },
    {
      icon: Zap,
      label: isRtl ? 'الجهد الكهربائي' : 'Power Specification',
      value: specs?.power_spec || '12V / 2A',
      sub: isRtl ? 'كفاءة طاقة عالية واستهلاك اقتصادي' : 'Energy efficient low-draw motor',
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
            <div className="w-10 h-10 rounded-full bg-brand-pale text-brand-olive flex items-center justify-center mb-4">
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
