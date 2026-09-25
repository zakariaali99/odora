import React from 'react';
import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme';
import { fontFamilies } from '../../theme/typography';
import { Card } from './Card';
import { IconButton } from './IconButton';
import { Badge } from './Badge';

interface ProductCardProps {
  name: string;
  category?: string;
  price: number; // In LYD
  imageSource: ImageSourcePropType;
  onPress: () => void;
  onAddToCart?: () => void;
  tag?: 'sale' | 'new';
  style?: StyleProp<ViewStyle>;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  name,
  category,
  price,
  imageSource,
  onPress,
  onAddToCart,
  tag,
  style,
}) => {
  const { t } = useTranslation();
  const { colors, typography, radii, spacing, isRTL } = useTheme();

  const formattedPrice = isRTL
    ? `${price.toLocaleString()} د.ل`
    : `${price.toLocaleString()} LYD`;

  return (
    <Card variant="compact" onPress={onPress} style={[styles.card, style]}>
      {/* Cream image frame */}
      <View
        style={[
          styles.imageFrame,
          {
            backgroundColor: colors.bgAlt,
            borderRadius: radii.md,
          },
        ]}
      >
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="contain"
        />

        {tag && (
          <View style={styles.tagWrapper}>
            <Badge
              label={tag === 'sale' ? t('store.sale', 'Sale') : t('store.new', 'New')}
              variant={tag === 'sale' ? 'warning' : 'accent'}
            />
          </View>
        )}
      </View>

      {/* Info row */}
      <View style={[styles.infoContainer, { marginTop: spacing.sm }]}>
        {category && (
          <Text
            style={[
              typography.labelSm,
              { color: colors.textSubtle, textAlign: 'left' },
            ]}
          >
            {category}
          </Text>
        )}

        <Text
          numberOfLines={1}
          style={[
            typography.bodyMd,
            {
              color: colors.text,
              fontWeight: '600',
              marginTop: 2,
              textAlign: 'left',
            },
          ]}
        >
          {name}
        </Text>

        <View style={[styles.bottomRow, { marginTop: spacing.xs }]}>
          <Text
            style={[
              typography.headlineSm,
              {
                color: colors.primary,
                fontWeight: '600',
                fontFamily: isRTL ? fontFamilies.arabic.semiBold : fontFamilies.latin.displaySemiBold,
              },
            ]}
          >
            {formattedPrice}
          </Text>

          {onAddToCart && (
            <IconButton
              name="add"
              onPress={onAddToCart}
              size={36}
              iconSize={18}
              backgroundColor={colors.surfaceMuted}
            />
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
  imageFrame: {
    width: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  tagWrapper: {
    position: 'absolute',
    top: 8,
    start: 8,
  },
  infoContainer: {
    width: '100%',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default ProductCard;
