import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { Icon, IconName } from './Icon';

export interface AppBarAction {
  icon?: IconName;
  avatar?: any;
  onPress: () => void;
  label?: string;
  badge?: number | string;
}

interface AppBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  actions?: AppBarAction[];
  leading?: React.ReactNode;
  children?: React.ReactNode;
  transparent?: boolean;
  centerTitle?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const AppBar: React.FC<AppBarProps> = ({
  title,
  showBack = false,
  onBack,
  actions = [],
  leading,
  children,
  transparent = false,
  centerTitle = false,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors, typography, isRTL } = useTheme();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: transparent ? 'transparent' : colors.bg,
        },
        style,
      ]}
    >
      <View style={styles.bar}>
        {/* Start Group: Back / Leading + Title */}
        <View
          style={[
            styles.startGroup,
            centerTitle && styles.startGroupCentered,
          ]}
        >
          {showBack ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleBack}
              style={styles.actionBtn}
              accessibilityLabel="Back"
              accessibilityRole="button"
              testID="appbar-back-button"
            >
              <Icon
                name="chevron_left"
                size={24}
                color={colors.text}
                autoMirror={true}
              />
            </TouchableOpacity>
          ) : (
            leading
          )}

          {children ? (
            children
          ) : title ? (
            <Text
              numberOfLines={1}
              style={[
                typography.headlineSm,
                {
                  color: colors.text,
                  fontSize: 18,
                  lineHeight: 26,
                  fontWeight: '600',
                  marginStart: showBack || leading ? 8 : 0,
                },
              ]}
            >
              {title}
            </Text>
          ) : null}
        </View>

        {/* Trailing Actions */}
        <View style={styles.trailing}>
          {actions.map((action, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.7}
              onPress={action.onPress}
              style={styles.actionBtn}
              accessibilityLabel={action.label}
              accessibilityRole="button"
              testID={action.icon === 'more_horiz' ? 'device-settings-button' : `appbar-action-${action.icon || idx}`}
            >
              {action.avatar ? (
                <View
                  style={[
                    styles.avatarWrap,
                    {
                      backgroundColor: colors.surfaceHigh,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Image
                    source={action.avatar}
                    style={styles.avatarImg}
                    resizeMode="cover"
                  />
                </View>
              ) : action.icon ? (
                <Icon
                  name={action.icon}
                  size={22}
                  color={colors.text}
                />
              ) : null}
              {action.badge !== undefined && (
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: colors.primary,
                      borderColor: colors.bg,
                    },
                  ]}
                >
                  <Text style={styles.badgeText}>{action.badge}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 50,
  },
  bar: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  startGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  startGroupCentered: {
    justifyContent: 'center',
  },
  trailing: {
    minWidth: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  avatarWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
});

export default AppBar;
