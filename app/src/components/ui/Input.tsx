import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  TextInputProps,
} from 'react-native';
import { useTheme } from '../../theme';
import { Icon, IconName } from './Icon';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  onTrailingIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  multiline?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leadingIcon,
  trailingIcon,
  onTrailingIconPress,
  containerStyle,
  multiline = false,
  style,
  ...props
}) => {
  const { colors, typography, radii, spacing, isRTL } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const hasError = !!error;
  const inputHeight = multiline ? 96 : 48;
  const borderRadius = multiline ? radii.md : radii.pill;

  let borderColor = colors.border;
  if (hasError) {
    borderColor = colors.error;
  } else if (isFocused) {
    borderColor = colors.primarySoft;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            typography.labelMd,
            {
              color: colors.textMuted,
              marginBottom: 6,
              textAlign: isRTL ? 'right' : 'left',
            },
          ]}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.surface,
            borderRadius,
            borderColor,
            borderWidth: isFocused || hasError ? 1.5 : 1,
            height: inputHeight,
            paddingHorizontal: spacing.md,
          },
        ]}
      >
        {leadingIcon && (
          <Icon
            name={leadingIcon}
            size={20}
            color={isFocused ? colors.primary : colors.textSubtle}
            style={{ marginEnd: 8 }}
          />
        )}

        <TextInput
          placeholderTextColor={colors.textSubtle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline}
          textAlign={isRTL ? 'right' : 'left'}
          style={[
            styles.textInput,
            typography.bodyMd,
            {
              color: colors.text,
              textAlignVertical: multiline ? 'top' : 'center',
              paddingVertical: multiline ? spacing.sm : 0,
            },
            style,
          ]}
          {...props}
        />

        {trailingIcon && (
          <Icon
            name={trailingIcon}
            size={20}
            color={colors.textSubtle}
            style={{ marginStart: 8 }}
          />
        )}
      </View>

      {hasError && (
        <Text
          style={[
            typography.bodySm,
            {
              color: colors.error,
              marginTop: 4,
              textAlign: isRTL ? 'right' : 'left',
              textTransform: 'none',
              letterSpacing: 0,
            },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  textInput: {
    flex: 1,
    height: '100%',
  },
});

export default Input;
