import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  Animated,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../../theme';

interface ToggleProps {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Toggle: React.FC<ToggleProps> = ({
  value,
  onValueChange,
  disabled = false,
  style,
}) => {
  const { colors, radii, elevation, motion, isRTL } = useTheme();
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: motion.base,
      useNativeDriver: false,
    }).start();
  }, [value, motion.base]);

  const toggle = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  // Interpolate thumb position within 48pt track (22pt thumb, 3pt margin)
  const thumbTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: isRTL ? [23, 3] : [3, 23],
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.surfaceMuted, colors.primary],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={toggle}
      disabled={disabled}
      style={[
        styles.container,
        {
          borderRadius: radii.pill,
          opacity: disabled ? 0.45 : 1,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.track,
          {
            backgroundColor,
            borderRadius: radii.pill,
            borderColor: colors.border,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'flex-start',
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              borderRadius: radii.pill,
              backgroundColor: colors.thumb,
              transform: [{ translateX: thumbTranslateX }],
            },
            elevation.e1,
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 28,
    justifyContent: 'center',
  },
  track: {
    width: 48,
    height: 28,
    justifyContent: 'center',
  },
  thumb: {
    width: 22,
    height: 22,
  },
});

export default Toggle;
