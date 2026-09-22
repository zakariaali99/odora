import React, { useRef, useState } from 'react';
import {
  View,
  PanResponder,
  StyleSheet,
  ViewStyle,
  StyleProp,
  LayoutChangeEvent,
} from 'react-native';
import { useTheme } from '../../theme';

interface SliderProps {
  value: number; // 0 to 1
  onChange: (value: number) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  disabled = false,
  style,
}) => {
  const { colors, radii, elevation, isRTL } = useTheme();
  const [trackWidth, setTrackWidth] = useState(200);
  const trackRef = useRef<View>(null);

  const clampedVal = Math.min(Math.max(value, 0), 1);

  const updateFromPosition = (pageX: number) => {
    if (disabled || trackWidth <= 0) return;
    trackRef.current?.measure((x, y, width, height, trackPageX) => {
      let touchX = pageX - trackPageX;
      if (isRTL) {
        touchX = width - touchX;
      }
      const newVal = Math.min(Math.max(touchX / width, 0), 1);
      onChange(newVal);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: (evt) => {
        updateFromPosition(evt.nativeEvent.pageX);
      },
      onPanResponderMove: (evt) => {
        updateFromPosition(evt.nativeEvent.pageX);
      },
    })
  ).current;

  const onLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  const thumbSize = 24;
  const thumbPosition = clampedVal * (trackWidth - thumbSize);

  return (
    <View
      style={[styles.container, style]}
      onLayout={onLayout}
      {...panResponder.panHandlers}
    >
      <View
        ref={trackRef}
        style={[
          styles.track,
          {
            backgroundColor: colors.surfaceMuted,
            borderRadius: radii.pill,
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${clampedVal * 100}%`,
              backgroundColor: colors.primarySoft,
              borderRadius: radii.pill,
              alignSelf: isRTL ? 'flex-end' : 'flex-start',
            },
          ]}
        />
      </View>
      <View
        style={[
          styles.thumb,
          {
            left: isRTL ? undefined : thumbPosition,
            right: isRTL ? thumbPosition : undefined,
            backgroundColor: colors.thumb,
            borderRadius: radii.pill,
            borderColor: colors.border,
            borderWidth: 1,
            opacity: disabled ? 0.5 : 1,
          },
          elevation.e1,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 44, // Touch target
    justifyContent: 'center',
    width: '100%',
  },
  track: {
    height: 8,
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    top: 10,
  },
});

export default Slider;
