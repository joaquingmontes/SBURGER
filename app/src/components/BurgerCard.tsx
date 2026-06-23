import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Burger } from '../constants/mockData';
import { Colors } from '../constants/colors';

interface BurgerCardProps {
  burger: Burger;
  onPress: () => void;
}

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
  },
  image: {
    width: 110,
    height: 110,
    backgroundColor: Colors.surface,
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
