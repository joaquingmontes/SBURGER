import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Burger } from '../constants/mockData';

interface BurgerCardProps {
  burger: Burger;
  onPress: () => void;
}

const CardColors = {
  cardBackground: '#1A1A1A',
  cardBorder: '#2A2A2A',
  textPrimary: '#FFFFFF',
  textSecondary: '#888888',
  textMuted: '#666666',
  accent: '#F39C12',
  imagePlaceholder: '#2A2A2A',
};

export const BurgerCard: React.FC<BurgerCardProps> = ({ burger, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Image
        source={{ uri: burger.image }}
        style={styles.image}
        resizeMode="cover"
      />
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

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: CardColors.cardBackground,
    borderRadius: 18,
    marginHorizontal: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: CardColors.cardBorder,
    overflow: 'hidden',
  },
  image: {
    width: 110,
    height: 110,
    backgroundColor: CardColors.imagePlaceholder,
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
    color: CardColors.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: CardColors.textSecondary,
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
    color: CardColors.accent,
  },
  seeMore: {
    fontSize: 12,
    color: CardColors.textMuted,
    fontWeight: '500',
  },
});
