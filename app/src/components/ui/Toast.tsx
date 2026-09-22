import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../../theme';
import { Icon, IconName } from './Icon';

interface ToastProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
  icon?: IconName;
  duration?: number; // default 4000ms per 05 §6
  style?: StyleProp<ViewStyle>;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  visible,
  onDismiss,
  icon = 'check',
  duration = 4000,
  style,
}) => {
  const { colors, typography, radii, spacing, elevation } = useTheme();
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          onDismiss();
        });
      }, duration);

      return () => clearTimeout(timer);
    } else {
      opacityAnim.setValue(0);
    }
  }, [visible, duration, opacityAnim, onDismiss]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: colors.ink,
          borderRadius: radii.pill,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          opacity: opacityAnim,
        },
        elevation.e2,
        style,
      ]}
    >
      <Icon
        name={icon}
        size={18}
        color={colors.onInk}
        style={{ marginEnd: 8 }}
      />
      <Text
        style={[
          typography.bodySm,
          {
            color: colors.onInk,
            fontWeight: '500',
          },
        ]}
      >
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 9999,
  },
});

export default Toast;
