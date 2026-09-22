import React from 'react';
import { Text, TextProps, StyleProp, TextStyle } from 'react-native';
import { fontFamilies } from '../../theme/typography';

export type LatinWeight = 'light' | 'regular' | 'medium' | 'semiBold';

export interface LatinTextProps extends TextProps {
  weight?: LatinWeight;
  style?: StyleProp<TextStyle>;
}

/**
 * Renders Latin text (product names, model codes, prices, metric units)
 * using the Outfit font family even inside an Arabic RTL interface.
 */
export const LatinText: React.FC<LatinTextProps> = ({
  weight = 'regular',
  style,
  children,
  ...props
}) => {
  let fontFamily = fontFamilies.latin.displayRegular;
  switch (weight) {
    case 'light':
      fontFamily = fontFamilies.latin.displayLight;
      break;
    case 'regular':
      fontFamily = fontFamilies.latin.displayRegular;
      break;
    case 'medium':
      fontFamily = fontFamilies.latin.displayMedium;
      break;
    case 'semiBold':
      fontFamily = fontFamilies.latin.displaySemiBold;
      break;
  }

  return (
    <Text style={[{ fontFamily }, style]} {...props}>
      {children}
    </Text>
  );
};

export default LatinText;
