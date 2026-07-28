import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Burger } from '../constants/mockData';
import { resolveProductImageUri } from '../constants/productImages';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Colors } from '../constants/colors';

interface BurgerCardProps {
  burger: Burger;
}

const BurgerCardComponent: React.FC<BurgerCardProps> = ({ burger }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Home'>>();
  const guestMode = route.params?.guestMode ?? false;
  const isOutOfStock = burger.stockStatus === 'sin_stock';

  const handlePress = useCallback(() => {
    if (isOutOfStock) {
      Alert.alert(
        'Sin stock',
        'Este producto no tiene stock disponible en la sucursal seleccionada.',
      );
      return;
    }

    navigation.navigate('Detail', { burger, guestMode });
  }, [navigation, burger, guestMode, isOutOfStock]);

  return (
    <TouchableOpacity
      style={[styles.card, isOutOfStock && styles.cardOutOfStock]}
      activeOpacity={0.85}
      onPress={handlePress}
    >
      <Image
        source={{ uri: resolveProductImageUri(burger.image, 'thumb') }}
        style={[styles.image, isOutOfStock && styles.imageOutOfStock]}
        resizeMode="cover"
        fadeDuration={0}
      />
      {isOutOfStock && (
        <View style={styles.outOfStockBadge}>
          <Text style={styles.outOfStockBadgeText}>Sin stock</Text>
        </View>
      )}
      <View style={styles.infoSection}>
        <Text style={styles.name} numberOfLines={1}>
          {burger.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {burger.description}
        </Text>
        <View style={styles.footerRow}>
          <Text style={styles.price}>
            ${burger.price.toLocaleString('es-AR')}
          </Text>
          <Text style={styles.seeMore}>Ver más →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const areEqual = (prev: BurgerCardProps, next: BurgerCardProps) =>
  prev.burger.id === next.burger.id &&
  prev.burger.name === next.burger.name &&
  prev.burger.description === next.burger.description &&
  prev.burger.price === next.burger.price &&
  prev.burger.image === next.burger.image &&
  prev.burger.category === next.burger.category &&
  prev.burger.stockStatus === next.burger.stockStatus;

export const BurgerCard = memo(BurgerCardComponent, areEqual);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: 18,
    marginHorizontal: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    position: 'relative',
  },
  cardOutOfStock: {
    opacity: 0.82,
  },
  image: {
    width: 110,
    height: 110,
    backgroundColor: Colors.surface,
  },
  imageOutOfStock: {
    opacity: 0.65,
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(17, 17, 17, 0.78)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  outOfStockBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  infoSection: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.accent,
  },
  seeMore: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});
