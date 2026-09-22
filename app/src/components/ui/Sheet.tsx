import React from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';

interface SheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Sheet: React.FC<SheetProps> = ({
  visible,
  onClose,
  children,
  style,
}) => {
  const { colors, radii, spacing, elevation } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.sheet,
                {
                  backgroundColor: colors.surface,
                  borderTopLeftRadius: radii.xl,
                  borderTopRightRadius: radii.xl,
                  paddingBottom: Math.max(insets.bottom, spacing.lg),
                  paddingHorizontal: spacing.lg,
                  borderColor: colors.border,
                  borderWidth: 1,
                },
                elevation.e2,
                style,
              ]}
            >
              {/* Frosted Handle bar */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onClose}
                style={styles.handleWrapper}
              >
                <View
                  style={[
                    styles.handle,
                    {
                      backgroundColor: colors.surfaceHigh,
                      borderRadius: radii.pill,
                    },
                  ]}
                />
              </TouchableOpacity>

              {/* Sheet content */}
              <View style={styles.content}>{children}</View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
    maxHeight: '85%',
  },
  handleWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 44,
    height: 5,
  },
  content: {
    width: '100%',
  },
});

export default Sheet;
