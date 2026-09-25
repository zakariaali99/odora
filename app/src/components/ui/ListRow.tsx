import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../../theme';
import { Icon, IconName } from './Icon';

interface ListRowProps {
  title: string;
  subtitle?: string;
  value?: string;
  icon?: IconName;
  onPress?: () => void;
  showChevron?: boolean;
  showDivider?: boolean;
  destructive?: boolean;
  trailingComponent?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const ListRow: React.FC<ListRowProps> = ({
  title,
  subtitle,
  value,
  icon,
  onPress,
  showChevron = true,
  showDivider = true,
  destructive = false,
  trailingComponent,
  style,
}) => {
  const { colors, typography, isRTL, spacing } = useTheme();

  const titleColor = destructive ? colors.error : colors.text;

  const content = (
    <View style={[styles.row, { minHeight: 56, paddingVertical: spacing.sm }]}>
      {icon && (
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: colors.surfaceMuted,
              marginEnd: spacing.md,
            },
          ]}
        >
          <Icon
            name={icon}
            size={20}
            color={destructive ? colors.error : colors.text}
          />
        </View>
      )}

      <View style={styles.textContainer}>
        <Text
          style={[
            typography.bodyMd,
            {
              color: titleColor,
              fontWeight: '500',
              textAlign: 'left',
            },
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[
              typography.bodySm,
              {
                color: colors.textSubtle,
                marginTop: 2,
                textAlign: 'left',
              },
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {value && (
        <Text
          style={[
            typography.bodyMd,
            {
              color: colors.textMuted,
              marginEnd: showChevron ? 6 : 0,
            },
          ]}
        >
          {value}
        </Text>
      )}

      {trailingComponent}

      {showChevron && onPress && (
        <Icon
          name="chevron_right"
          size={20}
          color={colors.textSubtle}
        />
      )}
    </View>
  );

  return (
    <View style={[styles.wrapper, style]}>
      {onPress ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPress}
          style={styles.touchable}
        >
          {content}
        </TouchableOpacity>
      ) : (
        content
      )}

      {showDivider && (
        <View
          style={[
            styles.divider,
            {
              backgroundColor: colors.border,
              marginStart: icon ? 48 + spacing.md : 0,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  touchable: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    width: '100%',
  },
});

export default ListRow;
