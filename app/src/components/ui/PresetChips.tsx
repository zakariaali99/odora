import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Chip } from './Chip';

export interface PresetOption {
  id: string;
  label: string;
  value: number;
  burstOnly?: boolean;
}

interface PresetChipsProps {
  currentValue: number;
  onSelect: (value: number) => void;
  hasBurstCapability?: boolean;
  presets?: PresetOption[];
  style?: StyleProp<ViewStyle>;
}

export const PresetChips: React.FC<PresetChipsProps> = ({
  currentValue,
  onSelect,
  hasBurstCapability = false,
  presets,
  style,
}) => {
  const { t } = useTranslation();

  const defaultPresets: PresetOption[] = [
    { id: 'gentle', label: t('presets.gentle', 'Gentle'), value: 2 },
    { id: 'medium', label: t('presets.medium', 'Medium'), value: 5 },
    { id: 'intense', label: t('presets.intense', 'Intense'), value: 8 },
    { id: 'boost', label: t('presets.boost', 'Boost'), value: 10, burstOnly: true },
  ];

  const activePresets = presets || defaultPresets;

  // Filter out Boost if device has no burst capability per 06 §1.2
  const visiblePresets = activePresets.filter(
    (p) => !p.burstOnly || hasBurstCapability
  );

  return (
    <View style={[styles.container, style]}>
      {visiblePresets.map((p) => {
        const isActive = currentValue === p.value;
        return (
          <Chip
            key={p.id}
            label={p.label}
            active={isActive}
            onPress={() => onSelect(p.value)}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});

export default PresetChips;
